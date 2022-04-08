const router = require("express").Router();
const { default: axios } = require("axios");
const { verifyRole } = require("../middleware/verify-role");
const Magazine = require("../models/magazine.model");
const options = {
  _id: 0,
  name: 1,
  count: 1,
  url: 1,
  mal_id: 1,
};

router.get("/:malIdList", async(req, res) => {
  try{
    const malIdList = req.params.malIdList.split(",");
    const list = await Promise.all(
      malIdList.map(async (malId) => {
        const magazine = Magazine.findOne({ mal_id: malId })
          .select(options)
          .lean();
        return magazine;
      })
    );
    res.send({
      message: list,
    });
  }catch(error){
    res.status(404).send({ error: "Something went wrong" });
  }
});
router.post("/:page", verifyRole("Admin"), async (req, res) => {
  const { page } = req.params;
  const axiosData = await axios(
    "https://api.jikan.moe/v4/magazines?page=" + page
  );
  const data = axiosData.data.data;
  const list = await Promise.all(
    data.map(async (magazine) => {
      const magazineData = await Magazine.findOneAndUpdate(
        { mal_id: magazine.mal_id },
        magazine,
        { new: true, upsert: true }
      )
        .select(options)
        .lean();
      return magazineData;
    })
  );
  res.send({ message: list });
});

module.exports = router;
