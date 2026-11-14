require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

/**
 * Creates the initial users only if they do not exist yet.
 * Credentials are never stored in the repository; pass them as
 * environment variables when running the script, for example:
 *
 *   SEED_ADMIN_NAME=... SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... \
 *   SEED_VIEWER_NAME=... SEED_VIEWER_EMAIL=... SEED_VIEWER_PASSWORD=... \
 *   npm run seed
 *
 * Existing users are skipped and never modified.
 */
function userFromEnv(prefix, role) {
    const name = process.env[`${prefix}_NAME`];
    const email = process.env[`${prefix}_EMAIL`];
    const password = process.env[`${prefix}_PASSWORD`];

    if (!email || !password) {
        return null;
    }

    return { name: name || email, email, password, role };
}

async function seedUsers() {
    try {
        const users = [
            userFromEnv("SEED_ADMIN", "admin"),
            userFromEnv("SEED_VIEWER", "viewer"),
        ].filter(Boolean);

        if (users.length === 0) {
            console.log(
                "No seed users configured. Set SEED_ADMIN_* and/or SEED_VIEWER_* environment variables."
            );
            process.exit(0);
        }

        await connectDB();

        for (const userData of users) {
            const existingUser = await User.findOne({
                email: userData.email.toLowerCase(),
            });

            if (existingUser) {
                console.log(`${userData.role} user already exists, skipped.`);
                continue;
            }

            const passwordHash = await bcrypt.hash(userData.password, 10);

            await User.create({
                name: userData.name,
                email: userData.email,
                passwordHash,
                role: userData.role,
            });

            console.log(`${userData.role} user created.`);
        }

        console.log("Seed completed.");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error.message);
        process.exit(1);
    }
}

seedUsers();
