import dotenv from "dotenv";
import { Server } from "http";
import app from "./app";
dotenv.config();
const port = 3000;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`Server is running on Port: ${port}`);
  });
}

main();
