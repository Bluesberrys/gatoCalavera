import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

// Functions
// Read JSON file
async function readJson(filePath) {
  try {
    const fileData = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(fileData);
    return jsonData;
  } catch (error) {
    console.error(`Error reading or parsing JSON file at ${filePath}:`, error);
    throw error;
  }
}

// Render page
async function renderPage(contentViewPath, { title, cssFiles = [], data = {} }) {
  const baseCss = ["styles.css"];
  const allCss = Array.from(new Set([...baseCss, ...cssFiles]));
  const contentHtml = await ejs.renderFile(contentViewPath, data);
  const fullHtml = await ejs.renderFile(path.join(__dirname, "views", "layout.ejs"), {
    title,
    cssFiles: allCss,
    content: contentHtml,
  });
  return fullHtml;
}

// Routes
// Get
app.get("/", async (req, res) => {
  try {
    const featuredProducts = await readJson(path.join(__dirname, "data", "featured.json"));

    const htmlFile = await renderPage(path.join(__dirname, "views", "partials", "home.ejs"), {
      title: "Home",
      cssFiles: ["styles-home.css"],
      data: { featured: featuredProducts.featured },
    });
    res.send(htmlFile);
  } catch (error) {
    res.status(500).send("Error loading home page");
  }
});

app.get("/about", async (req, res) => {
  try {
    const htmlFile = await renderPage(path.join(__dirname, "views", "partials", "about.ejs"), {
      title: "About",
      cssFiles: ["styles-about.css"],
    });
    res.send(htmlFile);
  } catch (error) {
    res.status(500).send("Error loading about page");
  }
});

app.get("/contact", async (req, res) => {
  try {
    const htmlFile = await renderPage(path.join(__dirname, "views", "partials", "contact.ejs"), {
      title: "Contact",
      cssFiles: ["styles-contact.css"],
    });
    res.send(htmlFile);
  } catch (error) {
    res.status(500).send("Error loading contact page");
  }
});

// Post
app.post("/contact-form", async (req, res) => {
  console.log(req.body);
  try {
    const htmlFile = await renderPage(path.join(__dirname, "views", "partials", "contact.ejs"), {
      title: "Contact",
      cssFiles: ["styles-contact.css"],
    });
    res.send(htmlFile);
  } catch (error) {
    res.status(500).send("Error loading contact page");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
