const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndIsAdmin,
} = require("./verifyToken");

const router = require("express").Router();
const CryptoJS = require("crypto-js");

//UPDATE
router.put("/update/:id", verifyTokenAndAuthorization, async (req, res) => {
  //Pour renseigner l'id il suffit de taper la donnée en brut juste après le "/"
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, //Permet de trouver le doc sur lequel update
      {
        $set: req.body, //Ce que je veux update
      },
      { new: true } //Retourne le document avec les modifications
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndIsAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id); //Je récupére le doc correspondant à l'id
    const { password, ...others } = user._doc; //Grâce au spreadOperator je retire le password (hashé) du résultat
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/findall", verifyTokenAndIsAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER STATS
//TODO:
//J'aimerais bien faire une route API stats, permettant de cibler une collection, puis recup une propriété précise d'un doc selon l'age et des critere spé
router.get("/stats/:category", verifyTokenAndIsAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1)); //Permet d'obtenir l'année n-1

  try {
    const data = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear }, //Permet de matcher les conditions
          // catagory: { $eq: req.body.category },
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" }, //Permet de récupérer les résultats par mois
          // search: { $search: "$category" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
