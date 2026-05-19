const express = require("express");
const { getDriveClient } = require("../config/googleDrive");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/:fileId", protect, async (req, res) => {
  try {
    const { fileId } = req.params;

    const drive = getDriveClient();

    const metadata = await drive.files.get({
      fileId,
      fields: "name, mimeType",
    });

    res.setHeader("Content-Type", metadata.data.mimeType);

    const driveResponse = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      {
        responseType: "stream",
      }
    );

    driveResponse.data
      .on("error", (error) => {
        console.error("Drive stream error:", error);
        res.status(500).end("Drive stream sırasında hata oluştu.");
      })
      .pipe(res);
  } catch (error) {
    console.error("Media route error:", error.message);

    res.status(500).json({
      message: "Medya dosyası alınırken hata oluştu.",
      error: error.message,
    });
  }
});

module.exports = router;