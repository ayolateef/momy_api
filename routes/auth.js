const express = require("express");
const {
  signup,
  verifyPhoneNum,
  login,
  forgotPassword,
  resetPassword,
  uploadDocuments,
  updateDetails,
  updatePassword,
} = require("../controller/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyPhoneNum", verifyPhoneNum);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/:id/documents", uploadDocuments);
router.put("/:id/updatedetails", updateDetails);
router.put("/:id/updatepassword", updatePassword);

module.exports = router;
