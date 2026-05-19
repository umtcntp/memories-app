require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

async function seedUsers() {
    try {
        await connectDB();

        const users = [
            {
                name: "Can",
                email: "umutcantop1998@gmail.com",
                password: "can123456",
                role: "admin",
            },
            {
                name: "Yonca",
                email: "sen.yoncaa@gmail.com",
                password: "yonca123456",
                role: "viewer",
            },
        ];

        for (const userData of users) {
            const existingUser = await User.findOne({
                email: userData.email.toLowerCase(),
            });

            if (existingUser) {
                console.log(`${userData.email} zaten mevcut, atlandı.`);
                continue;
            }

            const passwordHash = await bcrypt.hash(userData.password, 10);

            await User.create({
                name: userData.name,
                email: userData.email,
                passwordHash,
                role: userData.role,
            });

            console.log(`${userData.email} oluşturuldu.`);
        }

        console.log("Seed işlemi tamamlandı.");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error.message);
        process.exit(1);
    }
}

seedUsers();