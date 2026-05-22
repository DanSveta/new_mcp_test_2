# new_mcp_test_2# Article Skills MCP

An MCP server that forces Claude to write all articles in CAPS.

## Setup
1. `npm install`
2. `npm run build`
3. `node dist/index.js`

## Connect to Claude.ai
1. Go to Claude.ai → Settings → Connectors
2. Add connector URL: `https://your-railway-url.up.railway.app/sse`
3. Start a new chat and ask Claude to write an article

## How it works
When connected, Claude will call the `get_article_rules` tool
before writing any article and follow the CAPS rule automatically.