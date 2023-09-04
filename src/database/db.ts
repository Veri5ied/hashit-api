import mongoose from "mongoose";

mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.utb7vtf.mongodb.net/?retryWrites=true&w=majority`
);

const db = mongoose.connection;

db.on("error", (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

db.once("open", () => {
  console.log("Engine connected! Let's hashit");
});
