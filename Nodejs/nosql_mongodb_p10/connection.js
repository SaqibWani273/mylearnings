const mongoose = require("mongoose");

const connectMongoDb = async (mongooseUrl) => {
  const connection = await mongoose.connect(mongooseUrl);
  return connection;
};
module.exports = { connectMongoDb };
