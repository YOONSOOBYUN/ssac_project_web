var express = require("express");
const postController = require("../../controllers/postController");
const authModule = require("../../modules/authModule");
var router = express.Router();

router.post("/", authModule.loggedIn, postController.createPost);
router.post("/comment/:id", postController.comment);

router.get("/", postController.readAllPost);
router.get("/:id", postController.readDetailpost);

router.put("/:id", authModule.loggedIn, postController.updatepost);
router.delete("/:id", authModule.loggedIn, postController.deletepost); //μΈμ¦νμ

module.exports = router;
