const http = require("http");
const server = http.createServer(function (req, res) {
  const endpoint = req.url;
  console.log(`endpoint -> ${endpoint}`);
  switch (endpoint) {
    case "/":
      res.writeHead(200);
      res.end("Welcome to nodejs server home");
      break;
    case "/contact-us":
      res.writeHead(200);
      res.end("Welcome to the contact-us page of nodejs server");
      break;

    case "/about":
      res.writeHead(200);
      res.end("This is just a test server");
      break;

    case "/privacy-policy":
      res.writeHead(200);
      res.end("We are not having any privacy policy");
      break;

    default:
      res.writeHead(404);
      res.end("Not found, you are either lost or drunk");
      break;
  }
});
server.listen(8080, function () {
  console.log(`server is live at 8080`);
});
// https://www.cloudflare.com/learning/ddos/glossary/hypertext-transfer-protocol-http/
