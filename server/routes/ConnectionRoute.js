const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth");
const config = require("../config/config");
const Connection = require("../database/Models/Connection");
const { encryptSSH,decryptSSH } = require("../utils/encryption");

router.post("/add-connection", Auth, async (req,res) => {
  try {
        const {connectionName,ssh,hostName,ip,type} = req.body;

        if (!ssh || !connectionName || !hostName || !ip || !type) {
            return res.status(400).send({ error: "All fields are required" });
        }

        const sshEncrypted = encryptSSH(ssh);

        const connection = new Connection({
            type: type,
            owner_id: req.userId,
            sshEncrypted : sshEncrypted,
            name : connectionName,
            hostName : hostName,
            ip : ip
        });

        await connection.save();

        res.status(200).send({ _id : connection._id });

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