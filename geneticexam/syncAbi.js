const fs = require("fs");
const path = require("path");

const sourcePath = path.join(__dirname, "artifacts/contracts/DonorRegistry.sol/DonorRegistry.json");
const destinationPath = path.join(__dirname, "../frontend/src/contracts/contract-abi.json");

if (!fs.existsSync(sourcePath)) {
    console.error("❌ ABI source file not found!");
    process.exit(1);
}

// Ensure the destination directory exists
const destinationDir = path.dirname(destinationPath);
if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
}

fs.copyFileSync(sourcePath, destinationPath);
console.log("✅ ABI successfully copied to frontend!");
