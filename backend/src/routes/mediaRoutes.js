const express = require("express");
const { getDriveClient } = require("../config/googleDrive");
const { protect } = require("../middlewares/authMiddleware");
const { Readable } = require("stream");


const router = express.Router();


router.get("/:fileId/thumbnail", protect, async (req, res) => {
  try {
    const { fileId } = req.params;

    const drive = getDriveClient();

    const metadata = await drive.files.get({
      fileId,
      fields: "name, hasThumbnail, thumbnailLink",
    });

    const thumbnailLink = metadata.data.thumbnailLink;

    if (!thumbnailLink) {
      return res.status(404).json({
        message: "Bu dosya için Drive thumbnail bulunamadı.",
      });
    }

    const authClient = drive.context?._options?.auth;

    if (!authClient?.getRequestHeaders) {
      return res.status(500).json({
        message: "Drive kimlik bilgileri thumbnail isteği için hazırlanamadı.",
      });
    }

    const authHeaders = await authClient.getRequestHeaders(thumbnailLink);

    const thumbnailResponse = await fetch(thumbnailLink, {
      headers: authHeaders,
    });

    if (!thumbnailResponse.ok || !thumbnailResponse.body) {
      return res.status(thumbnailResponse.status || 500).json({
        message: "Drive thumbnail alınamadı.",
      });
    }

    res.setHeader(
      "Content-Type",
      thumbnailResponse.headers.get("content-type") || "image/jpeg"
    );

    res.setHeader("Cache-Control", "private, max-age=3600");

    Readable.fromWeb(thumbnailResponse.body).pipe(res);
  } catch (error) {
    console.error("Thumbnail route error:", error.message);

    res.status(500).json({
      message: "Thumbnail alınırken hata oluştu.",
      error: error.message,
    });
  }
});

router.get("/:fileId", protect, async (req, res) => {
  try {
    const { fileId } = req.params;
    const range = req.headers.range;

    const drive = getDriveClient();

    const metadata = await drive.files.get({
      fileId,
      fields: "name, mimeType, size",
    });

    const mimeType = metadata.data.mimeType || "application/octet-stream";
    const fileSize = Number(metadata.data.size);

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Accept-Ranges", "bytes");

    if (range && fileSize) {
      const match = range.match(/bytes=(\d*)-(\d*)/);

      if (!match) {
        return res.status(416).end();
      }

      const start = match[1] ? Number(match[1]) : 0;
      const end = match[2] ? Number(match[2]) : fileSize - 1;

      if (start >= fileSize || end >= fileSize || start > end) {
        res.setHeader("Content-Range", `bytes */${fileSize}`);
        return res.status(416).end();
      }

      const chunkSize = end - start + 1;

      res.status(206);
      res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      res.setHeader("Content-Length", chunkSize);

      const driveResponse = await drive.files.get(
        {
          fileId,
          alt: "media",
        },
        {
          responseType: "stream",
          headers: {
            Range: `bytes=${start}-${end}`,
          },
        }
      );

      driveResponse.data
        .on("error", (error) => {
          console.error("Drive range stream error:", error);
          if (!res.headersSent) {
            res.status(500);
          }
          res.end("Drive stream sırasında hata oluştu.");
        })
        .pipe(res);

      return;
    }

    if (fileSize) {
      res.setHeader("Content-Length", fileSize);
    }

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
        if (!res.headersSent) {
          res.status(500);
        }
        res.end("Drive stream sırasında hata oluştu.");
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