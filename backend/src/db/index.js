import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );

    if (connectionInstance.connection.host) {
      console.log(
        `\n MongoDB connected !! DB Host ${connectionInstance.connection.host}`
      );
    }

  } catch (error) {
    console.log("MONGODB Connection Error!!!", error);
    process.exit(1);
  }
};

export default connectDB;
