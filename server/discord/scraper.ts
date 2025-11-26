import * as cheerio from 'cheerio';

export interface TvsData {
  value: number;
  formatted: string;
  raw: string;
}

export async function scrapeTvsFromRedStone(): Promise<TvsData> {
  try {
    const response = await fetch('https://www.redstone.finance/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for TVS data in the page
    // The website shows "TOTAL VALUE SECURED" with a large value like "$8.67b"
    let tvsText = '';
    
    // Try to find the TVS value - it's typically in a large heading near "TOTAL VALUE SECURED"
    $('*').each((_, element) => {
      const text = $(element).text().trim();
      
      // Look for text that matches the pattern like "$8.67b" or "$850m"
      const tvsMatch = text.match(/\$[\d.]+[bmBM]/);
      if (tvsMatch && text.includes('TOTAL VALUE SECURED')) {
        const parent = $(element).parent();
        const siblings = parent.find('*');
        
        siblings.each((_, sibling) => {
          const siblingText = $(sibling).text().trim();
          const valueMatch = siblingText.match(/^\$[\d.]+[bmBM]$/);
          if (valueMatch) {
            tvsText = valueMatch[0];
          }
        });
      }
      
      // Also check if this element itself contains just the TVS value
      if (/^\$[\d.]+[bmBM]$/.test(text) && text.length < 15) {
        // Check if nearby elements mention TVS or Total Value Secured
        const prevText = $(element).prev().text().toLowerCase();
        const parentText = $(element).parent().text().toLowerCase();
        
        if (prevText.includes('total value secured') || 
            prevText.includes('tvs') ||
            parentText.includes('total value secured')) {
          tvsText = text;
        }
      }
    });

    if (!tvsText) {
      throw new Error('TVS value not found on the page');
    }

    // Parse the TVS value
    const value = parseTvsValue(tvsText);
    
    return {
      value,
      formatted: formatTvsValue(value),
      raw: tvsText
    };
  } catch (error) {
    throw new Error(`Failed to scrape TVS data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseTvsValue(tvsText: string): number {
  // Remove $ and convert to number
  const match = tvsText.match(/\$([\d.]+)([bmBM])/);
  if (!match) {
    throw new Error(`Invalid TVS format: ${tvsText}`);
  }

  const numValue = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  if (unit === 'b') {
    return numValue * 1_000_000_000;
  } else if (unit === 'm') {
    return numValue * 1_000_000;
  }

  throw new Error(`Unknown unit: ${unit}`);
}

function formatTvsValue(value: number): string {
  if (value >= 1_000_000_000) {
    // Billions - show 2 decimal places
    const billions = value / 1_000_000_000;
    return `$${billions.toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    // Millions - show whole numbers
    const millions = Math.round(value / 1_000_000);
    return `$${millions}M`;
  } else {
    // Less than a million - unlikely but handle it
    return `$${Math.round(value).toLocaleString()}`;
  }
}
