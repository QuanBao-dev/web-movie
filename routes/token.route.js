const { verifyRole } = require("../middleware/verify-role");
const router = require("express").Router();

router.get("/",verifyRole("User", "Admin"),(req,res) =>{
  //TODO  send userVm to define the role in client
  res.send({message: req.user})
})

module.exports = router