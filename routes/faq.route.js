const router = require("express").Router();
const { verifyRole } = require("../middleware/verify-role");
const Faq = require("../models/faq.model");
router.get("/", async (req, res) => {
  const dataFaq = await Faq.findOne({ name: "data" });
  if (!dataFaq) {
    return res.status(404).send({ error: "Don't have content" });
  }
  res.send({ message: dataFaq.html });
});

router.post("/", verifyRole("Admin"), async (req, res) => {
  const { html } = req.body;
  try {
    const dataFaq = await Faq.findOneAndUpdate(
      { name: "data" },
      {
        html,
      },
      {
        new: true,
        upsert: true,
      }
    )
      .lean()
      .select({ _id: 0, html: 1 });
    res.send({ message: dataFaq.html });
  } catch (error) {
    res.status(404).send({ error });
  }
});

module.exports = router;
