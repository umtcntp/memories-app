const express = require("express");
const { getDriveClient } = require("../config/googleDrive");
const { protect, allowRoles } = require("../middlewares/authMiddleware");
const Memory = require("../models/Memory");

const router = express.Router();

function mapDriveFileToMemoryPreview(file, folderName) {
    let type = "";

    if (file.mimeType?.startsWith("image/")) {
        type = "photo";
    }

    if (file.mimeType?.startsWith("video/")) {
        type = "video";
    }

    return {
        title: file.name,
        type,
        driveFileId: file.id,
        mimeType: file.mimeType,
        folderName,
        tags: [folderName],
    };
}

async function listChildren(drive, folderId) {
    const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: "files(id, name, mimeType, createdTime, modifiedTime)",
        pageSize: 1000,
    });

    return response.data.files || [];
}

router.get(
    "/memories-folder-preview",
    protect,
    allowRoles("admin"),
    async (req, res) => {
        try {
            const rootFolderId = process.env.GOOGLE_MEMORIES_ROOT_FOLDER_ID;

            if (!rootFolderId) {
                return res.status(400).json({
                    message: "GOOGLE_MEMORIES_ROOT_FOLDER_ID .env içinde tanımlı değil.",
                });
            }

            const drive = getDriveClient();

            const rootChildren = await listChildren(drive, rootFolderId);

            const folders = rootChildren.filter(
                (item) => item.mimeType === "application/vnd.google-apps.folder"
            );

            const previews = [];

            for (const folder of folders) {
                const files = await listChildren(drive, folder.id);

                const mediaFiles = files.filter(
                    (file) =>
                        file.mimeType?.startsWith("image/") ||
                        file.mimeType?.startsWith("video/")
                );

                const mappedFiles = mediaFiles.map((file) =>
                    mapDriveFileToMemoryPreview(file, folder.name)
                );

                previews.push({
                    folderId: folder.id,
                    folderName: folder.name,
                    count: mappedFiles.length,
                    files: mappedFiles,
                });
            }

            res.json({
                rootFolderId,
                folderCount: folders.length,
                folders: previews,
            });
        } catch (error) {
            console.error("Drive folder preview error:", error);
            res.status(500).json({
                message: "Drive klasörü okunurken hata oluştu.",
            });
        }
    }
);

router.post(
    "/import-memories-folder",
    protect,
    allowRoles("admin"),
    async (req, res) => {
        try {
            const rootFolderId = process.env.GOOGLE_MEMORIES_ROOT_FOLDER_ID;

            if (!rootFolderId) {
                return res.status(400).json({
                    message: "GOOGLE_MEMORIES_ROOT_FOLDER_ID .env içinde tanımlı değil.",
                });
            }

            const drive = getDriveClient();

            const rootChildren = await listChildren(drive, rootFolderId);

            const folders = rootChildren.filter(
                (item) => item.mimeType === "application/vnd.google-apps.folder"
            );

            let createdCount = 0;
            let skippedCount = 0;

            const createdMemories = [];
            const skippedFiles = [];

            for (const folder of folders) {
                const files = await listChildren(drive, folder.id);

                const mediaFiles = files.filter(
                    (file) =>
                        file.mimeType?.startsWith("image/") ||
                        file.mimeType?.startsWith("video/")
                );

                for (const file of mediaFiles) {
                    const existingMemory = await Memory.findOne({
                        driveFileId: file.id,
                    });

                    if (existingMemory) {
                        skippedCount += 1;
                        skippedFiles.push({
                            title: file.name,
                            driveFileId: file.id,
                            reason: "already_exists",
                        });
                        continue;
                    }

                    const type = file.mimeType.startsWith("image/")
                        ? "photo"
                        : "video";

                    const memory = await Memory.create({
                        title: file.name,
                        description: "",
                        type,
                        driveFileId: file.id,
                        date: file.createdTime ? new Date(file.createdTime) : undefined,
                        tags: [folder.name],
                        isFavorite: false,
                    });

                    createdCount += 1;
                    createdMemories.push(memory);
                }
            }

            res.status(201).json({
                message: "Drive import işlemi tamamlandı.",
                createdCount,
                skippedCount,
                createdMemories,
                skippedFiles,
            });
        } catch (error) {
            console.error("Drive import error:", error);
            res.status(500).json({
                message: "Drive import sırasında hata oluştu.",
            });
        }
    }
);

module.exports = router;