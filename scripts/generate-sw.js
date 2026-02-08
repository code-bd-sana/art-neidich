const fs = require("fs");
const path = require("path");

// Load env
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const templatePath = path.join(__dirname, "sw.template.js");
const outPath = path.join(__dirname, "..", "public", "sw.js");

if (!fs.existsSync(templatePath)) {
  console.error("sw.template.js not found");
  process.exit(1);
}

let content = fs.readFileSync(templatePath, "utf8");

const replacements = {
  "%%FIREBASE_API_KEY%%": process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  "%%FIREBASE_AUTH_DOMAIN%%":
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  "%%FIREBASE_PROJECT_ID%%": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  "%%FIREBASE_STORAGE_BUCKET%%":
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  "%%FIREBASE_MESSAGING_SENDER_ID%%":
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  "%%FIREBASE_APP_ID%%": process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Check for required variables
const required = Object.keys(replacements);
const missing = required.filter((key) => !replacements[key]);

if (missing.length > 0) {
  console.error("Missing required Firebase environment variables:", missing);
  process.exit(1);
}

// Replace placeholders
Object.entries(replacements).forEach(([key, value]) => {
  content = content.replace(new RegExp(key, "g"), value);
});

// Write the service worker
fs.writeFileSync(outPath, content, "utf8");
console.log("Service worker generated successfully at:", outPath);
