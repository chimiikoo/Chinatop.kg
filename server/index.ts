import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // API Routes
  const DATA_FILE = path.resolve(__dirname, "data", "products.json");
  const UPLOADS_DIR = path.resolve(__dirname, "..", "client", "public", "uploads");

  // Ensure uploads directory exists
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  } catch (err) {
    console.error("Error creating uploads dir:", err);
  }

  // Multer config for file uploads
  const storage = multer.diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (_req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });

  app.post("/api/upload", upload.single("image"), (req: any, res: any) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // Return the path relative to the public folder
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ url: filePath });
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (error) {
      console.error("Error reading products:", error);
      res.status(500).json({ error: "Failed to read products" });
    }
  });

  app.post("/api/login", (req, res) => {
    const { password } = req.body;
    // Simple hardcoded password for demonstration
    if (password === "chinatop007") {
      res.json({ success: true, token: "admin-secret-token" });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/products", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== "Bearer admin-secret-token") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving products:", error);
      res.status(500).json({ error: "Failed to save products" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 5000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
