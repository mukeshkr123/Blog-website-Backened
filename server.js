const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const { userRegisterCtrl } = require("./controllers/users/userCtrl");
const userRoutes = require("./routes/users/userRoutes");
const { errorHandler, notFound } = require("./middleware/error/errorHandler");
const postRoute = require("./routes/post/postRoutes");
const app = express();

// db connect
dbConnect();

//Middleware
app.use(express.json());
//cors
app.use(cors());

//Users Route
app.use("/api/users", userRoutes);
//Post Route
app.use("/api/posts", postRoute);

//Error Handler --> below all routes
app.use(notFound); // notfound
app.use(errorHandler);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running at ${PORT}`));
