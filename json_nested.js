const http = require("http");

const port = process.argv[2];

const server = http.createServer(function (req, res) {
  const fullUrl = new URL(req.url, "http://localhost");
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    if (req.method === "POST" && fullUrl.pathname === "/json-nested") {
      try {
        if (!body) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Empty body" }));
        }

        const parsedData = JSON.parse(body);
        const user = parsedData.user;

        if (
          !user ||
          (typeof user !== "object" && user !== null) ||
          typeof user.name !== "string" ||
          !Array.isArray(user.roles)
        ) {
          res.statusCode = 422;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Invalid format data" }));
        }

        const name = user.name;
        const roleCount = user.roles.length;
        const isAdmin = user.roles.includes("admin");

        const responseData = {
          name,
          roleCount,
          isAdmin,
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
