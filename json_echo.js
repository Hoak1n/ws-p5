const http = require("http");

const port = process.argv[2];

const server = http.createServer(function (req, res) {
  const fullUrl = new URL(req.url, "http://localhost");
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    if (req.method === "POST" && fullUrl.pathname === "/json-echo") {
      try {
        if (!body) throw new Error();

        const parsedData = JSON.parse(body);

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(parsedData));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  });
});

server.listen(port);
