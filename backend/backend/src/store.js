const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "db.json");

const initialData = {
  users: [],
  progress: [],
  labCompletions: [],
  chatHistory: []
};

function ensureStore() {
  fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(initialData, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeStore(data) {
  ensureStore();
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports = { readStore, writeStore };
