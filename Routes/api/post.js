const express = require("express");
const router = new express.Router();
const postController = require("../../Controllers/postController");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const Post = require("../../Models/posts");

router.get("/", postController.getPosts);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("picture"), async (req, res) => {
  console.log(req.file.path);
  const result = req.file.path;
  console.log(result);
  const post = new Post({
    title: req.body.title,
    img: result,
    price: req.body.price,
    caption: req.body.caption,
    style: req.body.style,
    brand: req.body.brand,
    size: req.body.size,
    condition: req.body.condition,
    color: req.body.color,
    tags: req.body.tags,
  });
  console.log(req.body);
  await post.save();
  res.json({ picture: req.file.path });
});

router.patch("/update/:id", postController.updatePost);
router.delete("/delete/:id", postController.deletePost);
module.exports = router;
