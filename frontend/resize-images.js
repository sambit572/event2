import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputImage = path.resolve("public/assets/home/herosection/heroimage1-720.webp");

const outputDir = path.dirname(inputImage);
const sizes = [180];

if (!fs.existsSync(inputImage)) {
  console.error("❌ Image not found:", inputImage);
  process.exit(1);
}

async function resizeImage() {
  const baseName = path.parse(inputImage).name;

  for (const width of sizes) {
    const outputPath = path.join(outputDir, `${baseName}-${width}.webp`);

    // Skip if already exists
    if (fs.existsSync(outputPath)) continue;

    await sharp(inputImage)
      .resize(width)
      .webp({
        quality: 70,
        effort: 6,
      })
      .toFile(outputPath);

    console.log(`✅ Created: ${baseName}-${width}.webp`);
  }

  console.log("🎉 heroimage3 responsive images generated");
}

resizeImage().catch(console.error);
