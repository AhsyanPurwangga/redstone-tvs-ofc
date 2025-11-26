# RedStone Oracle TVS Discord Bot

## Overview
A Discord bot that automatically displays and updates RedStone Oracle's Total Value Secured (TVS) data. The bot scrapes TVS information from the official RedStone website (https://www.redstone.finance/) and displays it in the bot's Discord presence/status.

## Purpose
Provides real-time TVS data from RedStone Oracle in Discord, making it easy for community members to see the current Total Value Secured at a glance.

## Current State
**Status:** Development Complete - Ready for Testing

The bot has been fully implemented with:
- Web scraping of TVS data from redstone.finance
- Discord bot integration using Replit's Discord connector
- Automatic updates every 15 minutes
- Number formatting (Billions/Millions display)
- Error handling with fallback to cached values
- Graceful shutdown handling

## Recent Changes
**Date:** November 26, 2025

### Discord Bot Implementation
- Created Discord client authentication module (`server/discord/client.ts`)
  - Implements token refresh and client connection management
  - Provides bot presence update functionality
  
- Built web scraper service (`server/discord/scraper.ts`)
  - Extracts TVS data from RedStone's website using Cheerio
  - Parses values in both Billions (B) and Millions (M) format
  - Formats numbers for readability ($X.XXB or $XXXM)
  
- Implemented bot orchestration (`server/discord/bot.ts`)
  - Schedules automatic updates every 15 minutes using node-cron
  - Handles errors gracefully with cached value fallback
  - Provides detailed logging for all operations
  - Implements graceful shutdown on SIGINT/SIGTERM
  
- Integrated bot startup in both development and production modes
  - Modified `server/index-dev.ts` and `server/index-prod.ts`
  - Bot starts automatically when application launches

## Project Architecture

### Backend Structure
```
server/
├── discord/
│   ├── bot.ts          # Main bot orchestration & scheduling
│   ├── client.ts       # Discord client authentication & presence updates
│   └── scraper.ts      # Web scraping & data formatting
├── app.ts              # Express application setup
├── index-dev.ts        # Development entry point (starts bot)
├── index-prod.ts       # Production entry point (starts bot)
└── routes.ts           # API routes (minimal - bot runs independently)
```

### Key Features
1. **Automatic Updates**: Uses node-cron to update TVS data every 15 minutes
2. **Smart Formatting**: Converts raw values to readable format (e.g., $8.67B, $850M)
3. **Error Resilience**: Falls back to cached values with ~ prefix if scraping fails
4. **Discord Presence**: Shows as "Watching TVS: $X.XXB | RedStone Oracle"
5. **Detailed Logging**: Timestamps all updates and errors for monitoring

### Dependencies
- **discord.js@14.16.3**: Discord bot library with OAuth integration
- **cheerio**: HTML parsing for web scraping
- **node-cron**: Scheduled task execution
- **express**: Web server (minimal usage)

## User Preferences
- Bot should display TVS values exactly as shown on RedStone's website
- Updates must occur every 15 minutes without fail
- Number formatting must distinguish between Millions (M) and Billions (B)
- Source must be the official redstone.finance website only

## How It Works

### Data Flow
1. Bot starts when application launches
2. Immediately scrapes TVS from redstone.finance
3. Updates Discord bot presence with formatted value
4. Schedules recurring updates every 15 minutes
5. On each update:
   - Fetches latest TVS from website
   - Formats the number appropriately
   - Updates bot presence
   - Logs the operation
6. If scraping fails:
   - Uses cached value with ~ prefix
   - Shows "⚠️ Data Unavailable" if no cache exists

### Bot Presence Format
```
Watching TVS: $8.67B | RedStone Oracle
```

Or on error with cache:
```
Watching TVS: ~$8.67B | RedStone Oracle
```

### Logging Format
Success:
```
✓ [11/26/2025, 02:30:45] TVS Updated: $8.67B (Raw: $8.67b)
```

Error:
```
✗ [11/26/2025, 02:45:45] Failed to update TVS: HTTP error! status: 503
  Using cached value: ~$8.67B
```

## Configuration

### Environment Variables
The bot uses Replit's Discord connector which automatically manages:
- `REPLIT_CONNECTORS_HOSTNAME`: Connector service hostname
- `REPL_IDENTITY`: Replit identity token
- OAuth tokens and refresh mechanisms

No manual environment variable configuration needed!

## Running the Bot

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

The bot will automatically start with the application and begin updating TVS data.

## Next Steps (Future Enhancements)
- Add Discord slash commands for manual TVS queries
- Implement historical TVS tracking with trend indicators
- Create configurable update intervals via bot commands
- Add rich embeds with charts and additional RedStone statistics
- Implement health check endpoint for monitoring
