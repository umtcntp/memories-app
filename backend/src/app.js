const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const memoryRoutes = require("./routes/memoryRoutes");
const authRoutes = require("./routes/authRoutes");
const healthRoutes = require("./routes/healthRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const driveRoutes = require("./routes/driveRoutes");

const {
    getAuthUrl,
    saveTokensFromCode,
    setSavedCredentials,
} = require("./config/googleDrive");

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/drive", driveRoutes);

app.get("/", (req, res) => {
    const hasToken = setSavedCredentials();

    if (!hasToken) {
        return res.send(`
      <h1>Memories API</h1>
      <p>Google Drive bağlantısı yapılmamış.</p>
      <a href="/auth/google">Google Drive'a bağlan</a>
    `);
    }

    res.send(`
    <h1>Memories API</h1>
    <p>Google Drive bağlantısı hazır.</p>
    <p>Health check: <a href="/api/health">/api/health</a></p>
    <p>Medya test için şu formatı kullan:</p>
    <code>/api/media/GOOGLE_DRIVE_FILE_ID</code>
  `);
});

app.get("/auth/google", (req, res) => {
    const authUrl = getAuthUrl();
    res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).send("Authorization code bulunamadı.");
        }

        await saveTokensFromCode(code);

        res.redirect("/");
    } catch (error) {
        console.error("OAuth callback error:", error);

        res.status(500).send("OAuth callback sırasında hata oluştu.");
    }
});

module.exports = app;