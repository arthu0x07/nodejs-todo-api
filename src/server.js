import http from "node:http";
import { routes } from "./routes.js";
import { Json } from "./middlewares/Json.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await Json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url); // criar o regex para testar as rotas
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    // get handle params
    const { ...params } = routeParams.groups;
    req.params = params;

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(3333);
