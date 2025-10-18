const http = require("node:http");
const fs = require("node:fs");

const server = http.createServer(function (req, res) {
  const endpoint = req.url;
  const methodtype = req.method;
  const logInfo = `\n${Date.now()} : ${methodtype} | ${endpoint}`;
  fs.appendFileSync("log.txt", logInfo);

  switch (methodtype) {
    case "GET":
      switch (endpoint) {
        case "/":
          return res.writeHead(200).end("Hello and welcome 🤠🤠");
        default:
          return res.writeHead(404).end("NOT FOUND  😢😢😢");
      }
    case "POST":
      switch (endpoint) {
        case "/tweet":
          return res.writeHead(200).end("Your tweet was tweeted 🐤🐤");
        default:
          return res.writeHead(404).end("NOT FOUND  😢😢😢");
      }

    default:
      return res.writeHead(404).end(`${methodtype} NOT FOUND  😢😢😢`);
  }
});
server.listen(8080, () => console.log("Server is live at 8080"));
