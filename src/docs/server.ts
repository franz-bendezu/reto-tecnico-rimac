// node http server withoout express
import http from "http";
import { createRequestListener } from "./swager-listener";

const server = http.createServer(createRequestListener());

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
