import cron from 'node-cron';
import { updateBotPresence, disconnectDiscordClient } from './client';
import { scrapeTvsFromRedStone, type TvsData } from './scraper';

let lastTvsData: TvsData | null = null;
let updateTask: cron.ScheduledTask | null = null;

function getCurrentTimestamp(): string {
  return new Date().toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

async function updateTvsData(): Promise<void> {
  try {
    const tvsData = await scrapeTvsFromRedStone();
    lastTvsData = tvsData;

    await updateBotPresence(tvsData.formatted);

    console.log(`✓ [${getCurrentTimestamp()}] TVS Updated: ${tvsData.formatted} (Raw: ${tvsData.raw})`);
  } catch (error) {
    console.error(`✗ [${getCurrentTimestamp()}] Failed to update TVS: ${error instanceof Error ? error.message : 'Unknown error'}`);

    // If we have cached data, use it with a ~ prefix to indicate it's cached
    if (lastTvsData) {
      try {
        await updateBotPresence(`~${lastTvsData.formatted}`);
        console.log(`  Using cached value: ~${lastTvsData.formatted}`);
      } catch (presenceError) {
        console.error(`  Failed to update presence with cached value: ${presenceError instanceof Error ? presenceError.message : 'Unknown error'}`);
      }
    } else {
      // No cached data, show error state
      try {
        await updateBotPresence('⚠️ Data Unavailable');
      } catch (presenceError) {
        console.error(`  Failed to update presence with error state: ${presenceError instanceof Error ? presenceError.message : 'Unknown error'}`);
      }
    }
  }
}

export async function startTvsBot(): Promise<void> {
  console.log('🤖 RedStone TVS Bot Started');
  console.log('📊 Update Interval: 15 minutes');
  console.log('🌐 Data Source: redstone.finance');
  console.log('');

  // Initial update
  await updateTvsData();

  // Schedule updates every 15 minutes
  // Cron pattern: */15 * * * * means "every 15 minutes"
  updateTask = cron.schedule('*/15 * * * *', async () => {
    await updateTvsData();
  });

  console.log('⏰ Scheduled automatic updates every 15 minutes');
}

export async function stopTvsBot(): Promise<void> {
  console.log('🛑 Stopping RedStone TVS Bot...');
  
  if (updateTask) {
    updateTask.stop();
    updateTask = null;
  }

  await disconnectDiscordClient();
  console.log('✓ Bot stopped successfully');
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await stopTvsBot();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await stopTvsBot();
  process.exit(0);
});
