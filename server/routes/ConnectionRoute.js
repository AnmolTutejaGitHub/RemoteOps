const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth");
const config = require("../config/config");
const Connection = require("../database/Models/Connection");
const { encryptSSH,decryptSSH } = require("../utils/encryption");

router.post("/add-connection", Auth, async (req,res) => {
  try {
        const {ssh,name} = req.body;

        if (!ssh) {
            return res.status(400).send({ error: "SSH key required" });
        }

        if (!name) {
            return res.status(400).send({ error: "name is required" });
        }

        const sshEncrypted = encryptSSH(ssh);

        const connection = new Connection({
            type: "Personal",
            owner_id: req.userId,
            sshEncrypted,
        });

        await connection.save();

        res.status(200).send({ message: "Connection saved" });

    } catch (err) {
        res.status(500).send({error : "server error"});
    }
});


router.get("/all-connections",Auth,async (req, res) => {
  try {
    const connections = await Connection.find({
      owner_id: req.userId,
    }).select("_id type createdAt").sort({ createdAt: -1 });

    res.status(200).json(connections);

  } catch(err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;