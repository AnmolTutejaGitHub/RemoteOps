const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth");
const config = require("../config/config");
const Connection = require("../database/Models/Connection");
const { encryptSSH,decryptSSH } = require("../utils/encryption");
const Group = require('../database/Models/Group');

router.post("/add-connection", Auth, async (req,res) => {
  try {
        const {connectionName,ssh,hostName,ip,type,groupId} = req.body;

        if (!ssh || !connectionName || !hostName || !ip || !type) {
            return res.status(400).send({ error: "All fields are required" });
        }

        if (type == "group" && !groupId) {
          return res.status(400).send({ error: "groupId is required for group type" });
        }

        let group = null;
        if (type == "group") {
          group = await Group.findById(groupId);

          if (!group) {
            return res.status(400).send({ error: "Group not found" });
          }

          if (group.createdBy.toString() != req.userId) {
            return res.status(400).send({
              error: "You do not have admin privileges for this group",
            });
          }
        }

        const sshEncrypted = encryptSSH(ssh);

        const connection = new Connection({
            type: type,
            owner: req.userId,
            sshEncrypted : sshEncrypted,
            name : connectionName,
            hostName : hostName,
            ip : ip,
            group: type == "group" ? groupId : null,
        });

        await connection.save();

        res.status(200).send({ _id : connection._id });

    } catch (err) {
        res.status(500).send({error : "server error"});
    }
});


router.get("/user-connections/personal",Auth,async (req,res) => {
  try {
    const connections = await Connection.find({
      owner: req.userId,
      type: "personal"
    })
      .select("_id name hostName ip createdAt")
      .sort({ createdAt: -1 })

    res.status(200).json(connections);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
})

router.get("/group-connections/:groupId",Auth,async(req,res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(400).json({ error: "Group not found" });
    }

    const isMember = group.members.some(
      (memberId) => memberId.toString() == req.userId
    );

    if (!isMember) {
      return res.status(400).json({ error: "You are not member of this group" });
    }

    const connections = await Connection.find({
      group: groupId
    })
      .select("_id name type hostName ip createdAt")
      .sort({ createdAt: -1 })

    res.status(200).json(connections);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
})

module.exports = router;

// user -> personal connections
// user -> group -> group connections