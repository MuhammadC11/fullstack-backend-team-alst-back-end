const express = require("express");
const router = new express.Router();
const userController = require("../../Controllers/userController");
const User = require("../../Models/user");

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pfp",
  },
});

const upload = multer({ storage: storage });

router.get("/:id", userController.getUser);

router.patch("/update/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const updates = Object.keys(req.body);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    console.log(updates);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.patch("/update/pfp/:id", upload.single("picture"), async (req, res) => {
  try {
    const result = req.file.path;
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        profile_picture: result,
      },

      {
        new: true,
      }
    ).exec();
    await user.save();
    res.json(user);
    console.log(req.file.path);
    console.log(user);
  } catch (error) {
    console.log(error, "test");
    res.json(user);
    console.log(req.file.path);
    console.log(user);
  }
});
router.delete("/delete/id", userController.deleteUser);
module.exports = router;
