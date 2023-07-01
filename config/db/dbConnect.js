const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Db Connected successfully");
  } catch (error) {
    console.log(`Erroc ${error.message}`);
  }
};

module.exports = dbConnect;
