import "dotenv/config";
import app from "./app.js";
import connectDB from "./database/db.js";

//MongoDB DNS Lookup issue(default was Windows, we set it to open DNS)
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is running at PORT:", PORT);
    });
  } catch (error) {
    console.log("Error starting server", error.message);
    process.exit(1);
  }
};

startServer();
