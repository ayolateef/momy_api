const express = require("express");
const {
  signup,
  verifyPhoneNum,
  login,
  forgotPassword,
  resetPassword,
  uploadDocuments
} = require("../controller/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyPhoneNum", verifyPhoneNum);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/:id/documents', uploadDocuments);

module.exports = router;
