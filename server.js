const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db/dbConnect");
const { userRegisterCtrl } = require("./controllers/users/userCtrl");
const app = express();

// db connect
dbConnect();

//Middleware
app.use(express.json());

//register routes
app.post("/api/users/register", userRegisterCtrl);

//login routes
app.post("/api/users/login", (req, res) => {
  //buisness logic
  res.json({ users: "user login" });
});

//fetch all users
app.get("/api/users", (req, res) => {
  //buisness logic
  res.json({ users: "user login" });
});

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running`));
