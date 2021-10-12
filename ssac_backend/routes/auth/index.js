var express = require("express");
const authController = require("../../controllers/authController");
const authModule = require("../../modules/authModule");
const upload = require("../../modules/awsUpload");
var router = express.Router();

router.get("/profile", authModule.loggedIn, authController.getProfile);

router.post("/signup", authController.signUp);
router.post("/signin", authController.signIn);
router.delete("/delele", authModule.loggedIn, authController.deleteuser); // 회원 탈퇴

router.post("/images", upload.single("img"), authController.uploadImage);
router.put("/profile/:id", authModule.loggedIn, authController.updateProfile);

module.exports = router;
