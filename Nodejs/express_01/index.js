// https://expressjs.com/en/starter/hello-world.html
const express = require("express");
const app = express();
app.get("/", (req, res) =>
  res.end("Welocme to my Server created with Express Js Framework")
);
app.get("/contact-me", (req, res) =>
  res.end("You can reach to me at test@gmail.com")
);
app.post("/submit", (req, res) =>
  res.status(201).end("Your request has been submitted")
);
app.listen(8081, () => console.log("We're live at 8081 port"));
