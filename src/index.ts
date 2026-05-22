import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { z } from "zod";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = new McpServer({
  name: "article-skills",
  version: "1.0.0",
});

// Tool that returns the article writing rules
server.tool(
  "get_article_rules",
  "Call this before writing any article to get the writing rules you must follow",
  {},
  async () => ({
    content: [{
      type: "text",
      text: readFileSync(join(__dirname, "../article-skill.md"), "utf-8")
    }]
  })
);

// SSE endpoint
const transports: Record<string, SSEServerTransport> = {};

app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  await server.connect(transport);
});

app.post("/messages", express.json(), async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(404).json({ error: "Session not found" });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "ok", server: "article-skills MCP" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});