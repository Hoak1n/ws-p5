const http = require("http");

const port = process.argv[2];

const server = http.createServer(function (req, res) {
  const fullUrl = new URL(req.url, "http://localhost");
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    if (req.method === "POST" && fullUrl.pathname === "/json-object") {
      try {
        if (!body) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: "Empty body" }));
        }

        const parsedData = JSON.parse(body);
        if (typeof parsedData.name !== "string" || typeof parsedData.age !== "number") {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Invalid name or age" }));
        }

        const responseData = {
          greeting: `Hello ${parsedData.name}`,
          isAdult: parsedData.age >= 18,
        };

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(responseData));
      } catch (err) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
      }
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  });
});

server.listen(port);
