import mongoose from "mongoose";
import logger from "../log";
import config from "../config";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.databaseUrl);

    logger.info({}, `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
