const express = require("express");
const dbConnect = require("./config/db/dbConnect");
const app = express();

// db connect
dbConnect();

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running`));

// mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.0

// mukeshmehta2041;
