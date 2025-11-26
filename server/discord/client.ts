import { Client, GatewayIntentBits, ActivityType } from 'discord.js';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=discord',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Discord not connected');
  }
  return accessToken;
}

let discordClient: Client | null = null;

export async function getDiscordClient(): Promise<Client> {
  if (discordClient && discordClient.isReady()) {
    return discordClient;
  }

  const token = await getAccessToken();

  discordClient = new Client({
    intents: [GatewayIntentBits.Guilds]
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
