const router = require("express").Router();

router.get("/", (req,res) => {
  ///TODO get all movie
  res.send({
    status:200,
    data:"hello world"
  })
})

module.exports = router;