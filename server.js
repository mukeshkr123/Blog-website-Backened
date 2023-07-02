const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const { userRegisterCtrl } = require("./controllers/users/userCtrl");
const userRoutes = require("./routes/users/userRoutes");
const errorHandler = require("./middleware/error/errorHandler");
const app = express();

// db connect
dbConnect();

//Middleware
app.use(express.json());

//Users Route
app.use("/", userRoutes);

//Error Handler --> below all routes
app.use(errorHandler);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running`));
