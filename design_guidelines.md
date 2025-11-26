# RedStone Oracle TVS Discord Bot - Design Guidelines

## Project Classification
This is a **backend automation bot** with no graphical user interface. The only user-facing element is the Discord bot's status/presence text visible in Discord servers.

## Bot Status Display Format

### Primary Display Pattern
```
🔴 TVS: $X.XXB | RedStone Oracle
```

**Format Specifications:**
- Use the red circle emoji (🔴) as RedStone's brand identifier
- Separate TVS value and source with pipe character ` | `
- Display "RedStone Oracle" for brand recognition

### Number Formatting Rules
- **Billions**: Display as `$X.XXB` (e.g., `$8.67B`, `$12.34B`)
- **Millions**: Display as `$XXXM` (e.g., `$850M`, `$42M`)
- **Precision**: 2 decimal places for billions, whole numbers for millions
- **Threshold**: Values ≥ $1B display in billions, < $1B display in millions

### Status Update Behavior
- Update bot presence every 15 minutes
- Use "Watching" activity type in Discord (appears as "Watching TVS: $X.XXB")
- On error: Display "⚠️ TVS: Data Unavailable" for maximum 1 update cycle

## Console/Logging Format

### Success Messages
```
✓ [TIMESTAMP] TVS Updated: $X.XXB (Raw: $XXX,XXX,XXX)
```

### Error Messages  
```
✗ [TIMESTAMP] Failed to fetch TVS: [Error reason]
```

### Startup Message
```
🤖 RedStone TVS Bot Started
📊 Update Interval: 15 minutes
🌐 Data Source: redstone.finance
```

## Data Integrity
- Always display dollar sign `$` prefix
- Never show raw unformatted numbers to users
- Maintain consistent spacing in status text
- Fallback to cached value if scraping fails (display with `~` prefix: `~$8.67B`)

This bot requires no visual design—focus is on clean, readable text formatting for Discord's status field.