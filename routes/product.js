const Product = require("../models/Product");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndIsAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE

router.post("/create", verifyTokenAndIsAdmin, async (req, res) => {
  // Only an admin can create a new product
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
//Le title étant unique je fais la maj sur cette donnée
router.put("/update/:id", verifyTokenAndIsAdmin, async (req, res) => {
  //Pour renseigner l'id il suffit de taper la donnée en brut juste après le "/"

  try {
    //TODO: Pouvoir passer en querry soit ID soit name et faire fonctionner le bouzin
    const updatedProduct = await Product.findOneAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/delete/:title", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    deletedProduct = await Product.findOneAndDelete({
      title: req.params.title,
    });
    res.status(200).json("Product has been deleted..." + deletedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET PRODUCT
router.get("/find/:name", async (req, res) => {
  console.log(req.params);
  try {
    const product = await Product.findOne({ title: req.params.name });
    //TODO: Implémenter Joi pour en cas de document non existant avoir une réponse plus précise
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL PRODUCT
router.get("/findall", async (req, res) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;

  try {
    let products;

    if (queryNew) {
      //FIXME: Selon la valeur de queryNew (1, -1) trier dans le bon sens les données
      products = await Product.find().sort({ createdAt: queryNew }).limit(2);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory],
        },
      })
        .sort({ createdAt: -1 })
        .limit(5);
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
