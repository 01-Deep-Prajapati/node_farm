const express = require("express");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const repleceTemplete = require("./modules/repleceTemplete");

const port = process.env.PORT || 3000;
const app = express();

// Load templates
const tempOverview = fs.readFileSync(
  path.join(__dirname, "templete-overview.html"),
  "utf-8"
);
const tempProduct = fs.readFileSync(
  path.join(__dirname, "templete-product.html"),
  "utf-8"
);
const tempCard = fs.readFileSync(
  path.join(__dirname, "templete-card.html"),
  "utf-8"
);

// Load data
const data = fs.readFileSync(path.join(__dirname, "data.json"), "utf-8");
const dataObj = JSON.parse(data);

// Overview route
app.get(["/", "/overview"], (req, res) => {
  const cardHtml = dataObj.map((el) => repleceTemplete(tempCard, el)).join("");
  const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
  res.status(200).send(output);
});

// Product route
app.get("/product", (req, res) => {
  const id = req.query.id;
  const product = dataObj[id];

  if (!product) {
    return res.status(404).send("<h1>Product not found!</h1>");
  }

  const output = repleceTemplete(tempProduct, product);
  res.status(200).send(output);
});

// API route
app.get("/api", (req, res) => {
  res.status(200).json(dataObj);
});

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .set("my-own-header", "This from deep")
    .send("<h1>Page not found!</h1>");
});

// Start server
app.listen(port, () => {
  console.log(`Listening on http://127.0.0.1:${port}`);
});
