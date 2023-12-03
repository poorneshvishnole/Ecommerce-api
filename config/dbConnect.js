import mongoose from "mongoose";

const dbConnect = async () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("Database is connected succesfully"))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

export default dbConnect;
