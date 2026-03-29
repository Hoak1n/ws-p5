const http = require("http");

const port = process.argv[2];

const server = http.createServer(function (req, res) {
  const fullUrl = new URL(req.url, "http://localhost");
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    if (req.method === "POST" && fullUrl.pathname === "/json-array") {
      try {
        if (!body) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Empty body" }));
        }

        const parsedData = JSON.parse(body);

        if (
          !Array.isArray(parsedData.numbers) ||
          !parsedData.numbers.every((n) => typeof n === "number")
        ) {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Invalid format data" }));
        }

        const numbers = parsedData.numbers;
        const count = numbers.length;
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        const average = count === 0 ? 0 : sum / count;

        const responseData = {
          count,
          sum,
          average,
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
