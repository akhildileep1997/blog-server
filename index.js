require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");


require("./config/db");

const userRoute = require("./Routes/userRoutes");
const blogRoutes = require("./Routes/blogRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const { addBlogController, updateBlogController } = require("./Controller/blogController");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"))

app.use("/user", userRoute);
app.use("/blogs", blogRoutes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "images"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const filename = uniqueSuffix + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

//route for adding blog
app.use("/blogs/new-blog", upload.single("image"), authMiddleware, addBlogController);
//route for updating blog
app.use('/blogs/update-your-blog/:id',upload.single("image"),authMiddleware,updateBlogController)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`app is listening in port ${PORT}`);
});
