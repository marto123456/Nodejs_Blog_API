const express = require("express")
const User = require("../models/User")
const Post = require("../models/Post")
const router = express.Router()

const bcrypt = require("bcrypt")

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10)
      req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      )

      res.status(200).json(updatedUser)
    } catch (err) {
      console.log(err)
      return res.status(500).json(err)
    }
  } else {
    res.status(401).json("You do not have permission to update this user")
  }
})

//delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id)

      try {
        await Post.deleteMany({ username: user.username })
        await User.findByIdAndDelete(req.params.id)
        res.status(400).json("User Deleted")
      } catch (err) {
        console.log(err)
        res.status(500).json(err)
      }
    } catch (err) {
      res.status(404).json("User not found")
    }
  } else {
    res.status(401).json("You cant delete this user")
  }
})

//Get a users by id
router.get("/:id", async (req, res) => {
  try {
    user = await User.findById(req.params.id)
    const { password, ...others } = user._doc
    res.status(200).json(others)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

//Get users
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
