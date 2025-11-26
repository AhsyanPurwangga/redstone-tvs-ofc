import { Client, GatewayIntentBits, ActivityType } from 'discord.js';

let discordClient: Client | null = null;

export async function getDiscordClient(): Promise<Client> {
  if (discordClient && discordClient.isReady()) {
    return discordClient;
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  
  if (!token) {
    throw new Error('DISCORD_BOT_TOKEN not found in environment variables');
  }

  discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds
    ]
  });

  await discordClient.login(token);

  // Wait for the client to be ready
  await new Promise<void>((resolve) => {
    discordClient!.once('ready', () => {
      resolve();
    });
  });

  return discordClient;
}

export async function updateBotPresence(tvsFormatted: string): Promise<void> {
  try {
    const client = await getDiscordClient();
    
    await client.user?.setPresence({
      activities: [{
        name: `TVS: ${tvsFormatted} | RedStone Oracle`,
        type: ActivityType.Watching
      }],
      status: 'online'
    });
  } catch (error) {
    throw new Error(`Failed to update bot presence: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function disconnectDiscordClient(): Promise<void> {
  if (discordClient) {
    await discordClient.destroy();
    discordClient = null;
  }
}
