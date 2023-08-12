const express = require("express")
const router = express.Router();
const pulseira = require("../../models/pulseira")

router.get("/", async (req, res) => {
    const pulseiras = await pulseira.findAll({order: [['id', 'ASC']]});
    res.render("admin", {pulseiras: pulseiras})
})

router.post("/cadpulseira", async (req, res) => {
    res.send(req.body)
})

module.exports = router