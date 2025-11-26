# RedStone Oracle TVS Discord Bot

## Overview
A Discord bot that automatically displays and updates RedStone Oracle's Total Value Secured (TVS) data. The bot fetches TVS information from RedStone's official API and displays it in the bot's Discord presence/status.

## Purpose
Provides real-time TVS data from RedStone Oracle in Discord, making it easy for community members to see the current Total Value Secured at a glance.

## Current State
**Status:** Production Ready

The bot has been fully implemented with:
- Real-time TVS data from RedStone's official API (`https://client-tvs.a.redstone.finance/tvs-sum`)
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
  - Provides bot presence update functionality with red circle branding
  
- Built data fetcher service (`server/discord/scraper.ts`)
  - Uses RedStone's official TVS API endpoint for accurate real-time data
  - Parses values in both Billions (B) and Millions (M) format
  - Formats numbers for readability ($X.XXB with 2 decimals, $XXXM whole numbers)
  
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
│   └── scraper.ts      # API data fetching & formatting
├── app.ts              # Express application setup
├── index-dev.ts        # Development entry point (starts bot)
├── index-prod.ts       # Production entry point (starts bot)
└── routes.ts           # API routes (minimal - bot runs independently)
```

### Key Features
1. **Official API Integration**: Uses RedStone's TVS API for accurate, real-time data
2. **Automatic Updates**: Uses node-cron to update TVS data every 15 minutes
3. **Smart Formatting**: Converts raw values to readable format (e.g., $8.70B, $850M)
4. **Error Resilience**: Falls back to cached values with ~ prefix if API fails
5. **Discord Presence**: Shows as "Watching 🔴 TVS: $X.XXB | RedStone Oracle"
6. **Detailed Logging**: Timestamps all updates and errors for monitoring

### Dependencies
- **discord.js@14.16.3**: Discord bot library with OAuth integration
- **cheerio**: HTML parsing (for potential future scraping needs)
- **node-cron**: Scheduled task execution
- **express**: Web server (minimal usage)

## User Preferences
- Bot should display TVS values from RedStone's official data source
- Updates must occur every 15 minutes without fail
- Number formatting must distinguish between Millions (M) and Billions (B)
- Billions displayed with 2 decimal places ($8.70B)
- Millions displayed as whole numbers ($850M)

## How It Works

### Data Flow
1. Bot starts when application launches
2. Immediately fetches TVS from RedStone API
3. Updates Discord bot presence with formatted value
4. Schedules recurring updates every 15 minutes
5. On each update:
   - Fetches latest TVS from API
   - Formats the number appropriately
   - Updates bot presence
   - Logs the operation
6. If API fails:
   - Uses cached value with ~ prefix
   - Shows "⚠️ Data Unavailable" if no cache exists

### Bot Presence Format
```
Watching 🔴 TVS: $8.70B | RedStone Oracle
```

Or on error with cache:
```
Watching 🔴 TVS: ~$8.70B | RedStone Oracle
```

### Logging Format
Success:
```
✓ [11/26/2025, 01:30:22] TVS Updated: $8.70B (Raw: $8.70b)
```

Error:
```
✗ [11/26/2025, 02:45:45] Failed to update TVS: HTTP error! status: 503
  Using cached value: ~$8.70B
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

## API Endpoint Reference
- **TVS API**: `https://client-tvs.a.redstone.finance/tvs-sum`
- Returns plain text value like `$8.70b`
- Updates in real-time as RedStone's TVS changes

## Next Steps (Future Enhancements)
- Add Discord slash commands for manual TVS queries
- Implement historical TVS tracking with trend indicators
- Create configurable update intervals via bot commands
- Add rich embeds with charts and additional RedStone statistics
- Implement health check endpoint for monitoring
