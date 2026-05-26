const express = require("express");
const Memory = require("../models/Memory");
const { protect, allowRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

function addMediaUrl(memory) {
  const memoryObject = memory.toObject();

  if (memoryObject.driveFileId) {
    memoryObject.mediaUrl = `/api/media/${memoryObject.driveFileId}`;
  }

  if (memoryObject.coverImageFileId) {
    memoryObject.coverImageUrl = `/api/media/${memoryObject.coverImageFileId}`;
  } else if (memoryObject.type === "video" && memoryObject.driveFileId) {
    memoryObject.coverImageUrl = `/api/media/${memoryObject.driveFileId}/thumbnail`;
  }

  return memoryObject;
}

router.get("/", protect, async (req, res) => {
    try {
        const { type, favorite, page = 1, limit = 30 } = req.query;

        const filter = {};

        if (type) filter.type = type;
        if (favorite === "true") filter.isFavorite = true;

        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
        const skip = (pageNumber - 1) * limitNumber;

        const total = await Memory.countDocuments(filter);

        const memories = await Memory.find(filter)
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        const memoriesWithMediaUrl = memories.map(addMediaUrl);

        res.json({
            count: memoriesWithMediaUrl.length,
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
            hasNextPage: pageNumber * limitNumber < total,
            data: memoriesWithMediaUrl,
        });
    } catch (error) {
        console.error("Get memories error:", error);
        res.status(500).json({
            message: "Anılar getirilirken hata oluştu.",
        });
    }
});

router.get("/:id", protect, async (req, res) => {
    try {
        const memory = await Memory.findById(req.params.id);

        if (!memory) {
            return res.status(404).json({
                message: "Anı bulunamadı.",
            });
        }

        res.json({
            data: addMediaUrl(memory),
        });
    } catch (error) {
        console.error("Get memory by id error:", error.message);

        res.status(500).json({
            message: "Anı alınırken hata oluştu.",
            error: error.message,
        });
    }
});

router.post("/", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            driveFileId,
            duration,
            artist,
            location,
            coverImageFileId,
            externalUrl,
            date,
            tags,
            isFavorite,
        } = req.body;

        const memory = await Memory.create({
            title,
            description,
            type,
            driveFileId,
            duration,
            artist,
            location,
            coverImageFileId,
            externalUrl,
            date,
            tags,
            isFavorite,
        });

        res.status(201).json({
            message: "Anı oluşturuldu.",
            data: memory,
        });
    } catch (error) {
        console.error("Create memory error:", error.message);

        res.status(400).json({
            message: "Anı oluşturulurken hata oluştu.",
            error: error.message,
        });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const memory = await Memory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!memory) {
            return res.status(404).json({
                message: "Anı bulunamadı.",
            });
        }

        res.json({
            message: "Anı güncellendi.",
            data: memory,
        });
    } catch (error) {
        console.error("Update memory error:", error.message);

        res.status(400).json({
            message: "Anı güncellenirken hata oluştu.",
            error: error.message,
        });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const memory = await Memory.findByIdAndDelete(req.params.id);

        if (!memory) {
            return res.status(404).json({
                message: "Anı bulunamadı.",
            });
        }

        res.json({
            message: "Anı silindi.",
            data: memory,
        });
    } catch (error) {
        console.error("Delete memory error:", error.message);

        res.status(500).json({
            message: "Anı silinirken hata oluştu.",
            error: error.message,
        });
    }
});

module.exports = router;
