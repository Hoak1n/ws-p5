const http = require("http");

const port = process.argv[2];

const server = http.createServer(function (req, res) {
  const fullUrl = new URL(req.url, "http://localhost");
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    if (req.method === "POST" && fullUrl.pathname === "/json-calc") {
      try {
        if (!body) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Empty body" }));
        }

        const parsedData = JSON.parse(body);

        if (
          typeof parsedData.a !== "number" ||
          typeof parsedData.b !== "number" ||
          typeof parsedData.operation !== "string"
        ) {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Invalid format data" }));
        }

        let result;
        const a = parsedData.a;
        const b = parsedData.b;
        const operation = parsedData.operation;

        switch (operation) {
          case "add":
            result = a + b;
            break;
          case "subtract":
            result = a - b;
            break;
          case "multiply":
            result = a * b;
            break;
          case "divide":
            if (b === 0) {
              res.statusCode = 400;
              res.setHeader("Content-Type", "application/json");
              return res.end(JSON.stringify({ error: "Division by zero" }));
            }
            result = a / b;
            break;
          default:
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify({ error: "Invalid operation" }));
        }

        const responseData = {
          result: result,
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
