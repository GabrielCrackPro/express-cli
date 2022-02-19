#! /usr/bin/env node
const inquirer = require("inquirer");
const { execSync } = require("child_process");
const fs = require("fs");

const main = async () => {
  console.log("Express CLI App Generator");
  if (fs.existsSync("./package.json")) {
    console.log("package.json found");
  } else {
    console.log("package.json not found");
    console.log("Creating package.json");
    execSync("npm init -y");
    console.log("package.json created");
  }
  let dependencies = [
    "express",
    "cors",
    "helmet",
    "morgan",
    "nodemon",
    "eslint",
  ];
  console.log("Installing basic dependencies");
  execSync(`npm install ${dependencies.join(" ")} -S`);
  console.log("Basic dependencies installed");
  inquirer
    .prompt({
      type: "confirm",
      name: "installMoreDependencies",
      message: "Do you want to install more dependencies?",
      default: false,
    })
    .then((answers) => {
      if (answers.installMoreDependencies) {
        inquirer
          .prompt({
            type: "input",
            name: "dependencies",
            message: "Enter dependencies to install",
            default: "",
            validate: (input) => {
              if (input.length > 0) {
                return true;
              } else {
                return "Please enter at least one dependency";
              }
            },
          })
          .then((answers) => {
            execSync(`npm install ${answers.dependencies} -S`);
            console.log("Dependencies installed");
          });
      }
    });
  console.log("Creating app.js");
  fs.writeFileSync(
    "./app.js",
    "const express = require('express');\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(3000, () => {\n  console.log('Example app listening on port 3000!');\n});"
  );
  console.log("app.js created");
  // edit package.json
  console.log("Editing package.json");
  let packageJson = require("./package.json");
  packageJson.scripts.start = "node app.js";
  packageJson.scripts.dev = "nodemon app.js";

  fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));
  console.log("package.json edited");
  inquirer
    .prompt({
      type: "confirm",
      name: "installEslint",
      message: "Do you want to install eslint?",
      default: false,
    })
    .then((answers) => {
      if (answers.installEslint) {
        execSync("npm install eslint -D");
        console.log("eslint installed");
        console.log("Setting up eslint");
        execSync("eslint --init");
        console.log("Adding lint script to package.json");
        packageJson.scripts.lint = "eslint .";
        fs.writeFileSync(
          "./package.json",
          JSON.stringify(packageJson, null, 2)
        );
        console.log("package.json edited");
      }
    });
};
