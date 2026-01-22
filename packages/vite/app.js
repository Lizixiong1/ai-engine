const connect = require("connect");

const http = require("http");

const fs = require("fs");
const path = require("path");
const { init, parse: parseEsModule } = require("es-module-lexer");

const app = connect();
const typeAlias = {
  js: "application/javascript",
  css: "text/css",
  html: "text/html",
  json: "application/json",
};
app.use(async function (req, res) {
  if (/\.js\??[^.]*$/.test(req.url)) {
    // js请求
    let js = fs.readFileSync(path.join(basePath, req.url), "utf-8");
    await init;
    let parseResult = parseEsModule(js);
    // ...
  }
});
// app.use((req, res) => {
//   if (req.url === "/index.html") {
//     let html = fs.readFileSync(path.join("./test1", "index.html"));
//     console.log(html);

//     res.setHeader("Content-Type", typeAlias.html);
//     res.statusCode = 200;
//     res.end(html);
//   } else {
//     res.end("");
//   }
// });

http.createServer(app).listen(3000);
