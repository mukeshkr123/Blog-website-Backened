const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mukeshmehta2041:ekCNZgnKghBI2JlW@cluster0.ayzqnne.mongodb.net/myfirstdb"
      //   {
      //     useCreateIndex: true,
      //     useFindAndModify: true,
      //     useUnified: true,
      //     useNewUrlParser: true,
      //   }
    );

    console.log("Db Connected successfully");
  } catch (error) {
    console.log(`Erroc ${error.message}`);
  }
};

module.exports = dbConnect;
