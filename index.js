const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoots = require("./routes/users");
const authRoots = require("./routes/auth");
const productRoots = require("./routes/product");
const cartRoots = require("./routes/cart");
const orderRoots = require("./routes/order");

dotenv.config(); //Key : Value de ce que contient le fichier .env

//TODO: En cas de mauvaise requete HTTP faire en sorte que l'API ne crash pas
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Success"))
  .catch((err) => console.log("Error: " + err));

app.use(express.json()); //Permet d'utiliser le JSON
app.use("/api/user", userRoots);
app.use("/api/auth", authRoots); //Route vers le module d'authentification
app.use("/api/product", productRoots);
app.use("/api/cart", cartRoots);
app.use("/api/order", orderRoots);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend Server is running");
});
