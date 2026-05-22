import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { Request, Response } from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

function createServer() {
  const server = new McpServer({
    name: "article-skills",
    version: "1.0.0",
  });

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

  return server;
}

app.post("/mcp", async (req: Request, res: Response) => {
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", server: "article-skills MCP" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});