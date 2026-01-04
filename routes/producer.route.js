const router = require("express").Router();
const { default: axios } = require("axios");
const { verifyRole } = require("../middleware/verify-role");
const Producer = require("../models/producer.model");
const options = {
  _id: 0,
  name: 1,
  count: 1,
  url: 1,
  mal_id: 1,
};

router.get("/:malIdList", async (req, res) => {
  try {
    const malIdList = req.params.malIdList.split(",");
    const list = await Promise.all(
      malIdList.map(async (malId) => {
        const producer = Producer.findOne({ mal_id: malId })
          .select(options)
          .lean();
        return producer;
      })
    );
    res.send({
      message: list,
    });
  } catch (error) {
    res.status(404).send({ error: "Something went wrong" });
  }
});
router.post("/:page", verifyRole("Admin"), async (req, res) => {
  const { page } = req.params;
  const axiosData = await axios(
    "https://api.jikan.moe/v4/producers?page=" + page
  );
  const data = axiosData.data.data;
  const list = await Promise.all(
    data.map(async (producer) => {
      const producerData = await Producer.findOneAndUpdate(
        { mal_id: producer.mal_id },
        producer,
        { new: true, upsert: true }
      )
        .select(options)
        .lean();
      return producerData;
    })
  );
  console.log(list);
  res.send({ message: list });
});

module.exports = router;
