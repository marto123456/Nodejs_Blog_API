const express = require("express")
const User = require("../models/User")
const router = express.Router()

const bcrypt = require("bcrypt")

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    })
    const user = await newUser.save()
    res.status(200).json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

//login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      res.status(400).json("Invalid Credentials")
    }
    const validate = await bcrypt.compare(req.body.password, user.password)
    !validate && res.status(400).json("Invalid credentials")
    const { password, ...others } = user._doc
    res.status(400).json(others)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})

module.exports = router
