#! /usr/bin/env node
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const fs = require("fs");

const main = async () => {
  console.log("\n");
  console.log("š Express CLI App Generator š\n");
  let dependencies = [];
  console.log("š Checking package.json...");
  await wait(1000);
  if (fs.existsSync("./package.json")) {
    console.log("\nš¦ package.json found");
    checkDepedencies(dependencies);
  } else {
    console.log("\nš«šØ package.json not found š«šØ");
    console.log("\nš¦ Creating package.json...");
    execSync("npm init -y");
    wait(1000);
    console.log("\nā package.json created\n");
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
  console.log("\nš§ Installing basic dependencies...");
  dependencies.forEach((dependency) => {
    try {
      execSync(`npm install ${dependency}`);
      console.log(`\nā ${dependency} installed successfully`);
    } catch (err) {
      console.log(`\nš«šØ ${dependency} not found š«šØ`);
    }
  });
  console.log("\nā Basic dependencies installed");
  console.log("\nš Creating app.js...");
  fs.writeFileSync(
    "./app.js",
    "const express = require('express');\nconst morgan = require('morgan');\nconst app = express();\n\napp.use(morgan('dev'));\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(3000, () => {\n  console.log('Example app listening on port 3000!');\n});"
  );
  await wait(1000);
  console.log("\nā app.js created");
  await wait(1000);
  console.log("\nš¦ Editing package.json...");
  let packageJson = require("./package.json");
  packageJson.scripts.start = "node app.js";
  await wait(1000);
  console.log("\nā start script changed");
  packageJson.scripts.dev = "nodemon app.js";
  await wait(1000);
  console.log("\nā dev script added");
  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
  await wait(1000);
  console.log("\nā package.json updated successfully");
  console.log("\nš Checking for README.md...");
  await wait(1000);
  if (fs.existsSync("./README.md")) {
    console.log("\nā README.md found");
  } else {
    console.log("\nš«šØ README.md not found š«šØ\n");
    await inquirer
      .prompt({
        type: "confirm",
        name: "createReadme",
        message: "š Do you want to create a README.md?",
        default: true,
      })
      .then((answers) => {
        if (answers.createReadme) {
          console.log("\nš Creating README.md...");
          fs.writeFileSync(
            "./README.md",
            "## Express CLI App Generator\n\nThis is a simple app generator for Express.js.\n\n## Usage\n\n```bash\nnpm start```\n\n## Development\n\n```bash\nnodemon app.js```\n\n"
          );
          wait(1000);
          console.log("\nā README.md created");
        }
      });
    console.log("\nā Script completed successfully\n");
    console.log("š Happy coding! š\n");
    process.exit(0);
  }
};

const checkDepedencies = (dependencies) => {
  for (let i = 0; i < dependencies.length; i++) {
    try {
      execSync(`npm list ${dependencies[i]}`);
      console.log(`\nā ${dependencies[i]} already installed`);
      dependencies.splice(i, 1);
    } catch (err) {
      console.log(`\nš«šØ ${dependencies[i]} not found š«šØ`);
    }
  }
};
const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
main();
