require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5050;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
  });
}

startServer();