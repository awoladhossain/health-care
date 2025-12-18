import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
import config from "./config";
dotenv.config();
const port = config.port || 5000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`);
  });
}

main();
