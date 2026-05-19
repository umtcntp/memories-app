const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const credentialsPath = path.join(__dirname, "../../credentials.json");
const tokenPath = path.join(__dirname, "../../token.json");

const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

const { client_id, client_secret } = credentials.web;

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  process.env.GOOGLE_REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
}

async function saveTokensFromCode(code) {
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

  return tokens;
}

function setSavedCredentials() {
  if (!fs.existsSync(tokenPath)) {
    return false;
  }

  const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  oauth2Client.setCredentials(tokens);

  return true;
}

function getDriveClient() {
  const hasToken = setSavedCredentials();

  if (!hasToken) {
    throw new Error("Google Drive token bulunamadı. Önce OAuth bağlantısı yapılmalı.");
  }

  return google.drive({
    version: "v3",
    auth: oauth2Client,
  });
}

module.exports = {
  getAuthUrl,
  saveTokensFromCode,
  setSavedCredentials,
  getDriveClient,
};