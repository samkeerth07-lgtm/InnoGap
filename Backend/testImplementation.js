const {
  analyzeImplementation
} = require("./src/analyzers/implementationAnalyzer");

const readme = `
# Smart Room System

## Demo

[Live Demo](https://example.com/demo)

## Installation

npm install
npm start

## Prototype

This project was developed as a working prototype.
`;

const files = [
  "README.md",
  "package.json",
  "src/server.js"
];

const result = analyzeImplementation(readme, files);

console.log(JSON.stringify(result, null, 2));