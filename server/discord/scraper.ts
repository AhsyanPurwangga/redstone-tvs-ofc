export interface TvsData {
  value: number;
  formatted: string;
  raw: string;
}

export async function scrapeTvsFromRedStone(): Promise<TvsData> {
  try {
    const response = await fetch('https://client-tvs.a.redstone.finance/tvs-sum', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Origin': 'https://www.redstone.finance',
        'Referer': 'https://www.redstone.finance/'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const value = parseFloat(text.trim());

    if (isNaN(value)) {
      throw new Error(`Invalid TVS value received: ${text}`);
    }

    return {
      value,
      formatted: formatTvsValue(value),
      raw: `$${(value / 1_000_000_000).toFixed(2)}b`
    };
  } catch (error) {
    throw new Error(`Failed to fetch TVS data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function formatTvsValue(value: number): string {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `$${billions.toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    const millions = Math.round(value / 1_000_000);
    return `$${millions}M`;
  } else {
    return `$${Math.round(value).toLocaleString()}`;
  }
}
