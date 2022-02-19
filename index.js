#! /usr/bin/env node
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const fs = require("fs");

const main = async () => {
  console.log("\n");
  console.log("🚀 Express CLI App Generator 🚀\n");
  let dependencies = [];
  console.log("🔎 Checking package.json...");
  await wait(1000);
  if (fs.existsSync("./package.json")) {
    console.log("\n📦 package.json found");
    checkDepedencies(dependencies);
  } else {
    console.log("\n🚫🚨 package.json not found 🚫🚨");
    console.log("\n📦 Creating package.json...");
    execSync("npm init -y");
    wait(1000);
    console.log("\n✅ package.json created\n");
  }
  await inquirer
    .prompt({
      type: "input",
      name: "moreDependencies",
      message:
        "Type the name of the dependencies you want to install (separated by commas):",
      default: "express, cors, helmet, morgan, nodemon",
    })
    .then((answers) => {
      if (answers.moreDependencies !== "") {
        dependencies.push(...answers.moreDependencies.split(","));
      }
    });
  checkDepedencies(dependencies);
  console.log("\n🚧 Installing basic dependencies...");
  dependencies.forEach((dependency) => {
    try {
      execSync(`npm install ${dependency}`);
      console.log(`\n✅ ${dependency} installed successfully`);
    } catch (err) {
      console.log(`\n🚫🚨 ${dependency} not found 🚫🚨`);
    }
  });
  console.log("\n✅ Basic dependencies installed");
  console.log("\n🚀 Creating app.js...");
  fs.writeFileSync(
    "./app.js",
    "const express = require('express');\nconst morgan = require('morgan');\nconst app = express();\n\napp.use(morgan('dev'));\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(3000, () => {\n  console.log('Example app listening on port 3000!');\n});"
  );
  await wait(1000);
  console.log("\n✅ app.js created");
  await wait(1000);
  console.log("\n📦 Editing package.json...");
  let packageJson = require("./package.json");
  packageJson.scripts.start = "node app.js";
  await wait(1000);
  console.log("\n✅ start script changed");
  packageJson.scripts.dev = "nodemon app.js";
  await wait(1000);
  console.log("\n✅ dev script added");
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
  await wait(1000);
  console.log("\n✅ package.json updated successfully");
  console.log("\n🔎 Checking for README.md...");
  await wait(1000);
  if (fs.existsSync("./README.md")) {
    console.log("\n✅ README.md found");
  } else {
    console.log("\n🚫🚨 README.md not found 🚫🚨\n");
    await inquirer
      .prompt({
        type: "confirm",
        name: "createReadme",
        message: "📖 Do you want to create a README.md?",
        default: true,
      })
      .then((answers) => {
        if (answers.createReadme) {
          console.log("\n📖 Creating README.md...");
          fs.writeFileSync(
            "./README.md",
            "## Express CLI App Generator\n\nThis is a simple app generator for Express.js.\n\n## Usage\n\n```bash\nnpm start```\n\n## Development\n\n```bash\nnodemon app.js```\n\n"
          );
          wait(1000);
          console.log("\n✅ README.md created");
        }
      });
    console.log("\n✅ Script completed successfully\n");
    console.log("🚀 Happy coding! 🚀\n");
    process.exit(0);
  }
};

const checkDepedencies = (dependencies) => {
  for (let i = 0; i < dependencies.length; i++) {
    try {
      execSync(`npm list ${dependencies[i]}`);
      console.log(`\n✅ ${dependencies[i]} already installed`);
      dependencies.splice(i, 1);
    } catch (err) {
      console.log(`\n🚫🚨 ${dependencies[i]} not found 🚫🚨`);
    }
  }
};
const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
main();
