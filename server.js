const express = require("express")
const app = express()

const dotenv = require("dotenv")
dotenv.config()
const mongoose = require("mongoose")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const userRoute = require("./routes/users")
const categoryRoute = require("./routes/categories")
const bodyParser = require("body-parser")
const multer = require("multer")

mongoose
  .connect(process.env.CONNECTIONSTRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Database connected"))
  .catch((err) => console.log(err))

app.use(bodyParser.json())

// application storage
const storage = multer.diskStorage({
  //the cb or callback takes care of any errors
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name)
  },
})
//setup the correct user email on my local git so i can see my exact username in the commit

const upload = multer({ storage: storage })
app.post("api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file uploaded")
})

app.use("/api", authRoute)
app.use("/api/user", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/categories", categoryRoute)

app.listen("5000", (req, res) => {
  console.log("connected")
})
