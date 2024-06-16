const TOKEN_FILE_PATH = "./token.json";
const fs = require("fs");

const ERROR_MESSAGE =
  "\nLoi dinh dang Token, vui long paste Token vao file token.json\nXem cach lay Token tai j2c.cc/quack\n";

function loadUserLoginInfo() {
  let content = "";
  try {
    content = fs.readFileSync(TOKEN_FILE_PATH, "utf8");
  } catch {
    fs.writeFileSync(TOKEN_FILE_PATH, "");
  }

  try {
    return JSON.parse(content);
  } catch {
    console.error(ERROR_MESSAGE);
    process.exit(1);
  }
}

function loadToken() {
  const TELEGRAM_USER = loadUserLoginInfo();
  const ACCESS_TOKEN = TELEGRAM_USER?.state?.token;
  if (!ACCESS_TOKEN) {
    console.error(ERROR_MESSAGE);
    process.exit(1);
  }
  return ACCESS_TOKEN;
}

module.exports = loadToken;
