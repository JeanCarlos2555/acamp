const express = require("express")
const router = express.Router();
const pulseira = require("../../models/Pulseira")

router.get("/", async (req, res) => {
    const pulseiras = await pulseira.findAll({order: [['id', 'ASC']]});
    res.render("admin", {pulseiras: pulseiras})
})

router.post("/cadpulseira", async (req, res) => {
    res.send(req.body)
    console.log(req.body)
})

module.exports = router