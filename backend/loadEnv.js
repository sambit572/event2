import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect current environment (fallback to development)
const NODE_ENV = process.env.NODE_ENV || "development";
const envFile = `.env.${NODE_ENV}`;

// Load the corresponding .env file
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Log it out for clarity
console.log(`✅ Environment loaded: ${envFile}`);

export default NODE_ENV;
