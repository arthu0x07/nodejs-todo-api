import http from "node:http";
import { routes } from "./routes";
import { Json } from "./middlewares/Json";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await Json(req, res);

});

server.listen(3333);
