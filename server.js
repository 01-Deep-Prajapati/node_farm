const fs = require("fs");
const http = require("http");
const url = require("url");

const repleceTemplete = require("./modules/repleceTemplete");

const tempOverview = fs.readFileSync(
  `${__dirname}/templete-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templete-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/templete-card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/HTML" });
    const cardHtml = dataObj
      .map((el) => repleceTemplete(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);
  }
  //product
  else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/HTML" });
    const product = dataObj[query.id];
    const output = repleceTemplete(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/JSON" });
    res.end(dataObj);
  }
  //not found
  else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "This from deep",
    });
    res.end("<h1>Page not found!</h1>");
  }
});
server.listen(4000, "127.0.0.1", () => {
  console.log("listing requsests on port 4000");
});
