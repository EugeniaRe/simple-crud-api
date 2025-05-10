import { createServer } from "http";
import dotenv from "dotenv";
import { router } from "./router";

dotenv.config();

const PORT = process.env.PORT || 4000;

const server = createServer(router);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close();
  process.exit();
});
