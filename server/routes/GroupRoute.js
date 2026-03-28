const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth");
const config = require("../config/config");
const Group = require("../database/Models/Group");
const User = require("../database/Models/User");

router.post("/create-group",Auth,async (req,res) => {
  try {
    const { groupName } = req.body;

    if (!groupName || !groupName.trim()) {
      return res.status(400).json({ error: "Group name is required" });
    }

    const group_name = groupName.trim();

    const group = new Group({
      name: group_name,
      createdBy: req.userId,
      members: [req.userId],
    });

    await group.save();

    res.status(200).json({
      message: "Group created successfully",
      groupId: group._id
    });

  } catch (error) {
    res.status(500).json({ error: "some error occurred" });
  }
})

router.post("/add-member",Auth,async (req,res) => {
  try {
    const { member_email,grp_id } = req.body;

    if (!member_email || !grp_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email: member_email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const group = await Group.findById(grp_id);
    if (!group) {
      return res.status(400).json({ error: "Group not found" });
    }

    if (group.createdBy.toString() != req.userId) {
      return res.status(403).json({
        error: "You do not have admin privileges for this group",
      });
    }

    const alreadyMember = group.members.some(
        (memberId) => memberId.equals(user._id)
    );

    if (alreadyMember) {
      return res.status(400).json({ error: "User already in group" });
    }

    group.members.push(user._id);

    await group.save();

    res.status(200).json({ message: "Member added successfully" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
})

router.get("/user-groups",Auth,async(req,res) => {
  try {
    const groups = await Group.find({
      members: req.userId
    })
      .select("_id name createdBy createdAt")
      .populate("createdBy","email")
      .sort({ createdAt: -1 })

    res.status(200).json(groups);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
})

router.get("/user-admin-groups", Auth, async (req, res) => {
  try {
    const groups = await Group.find({
      createdBy: req.userId
    })
      .select("_id name createdAt")
      .sort({ createdAt: -1 })

    res.status(200).json(groups);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;