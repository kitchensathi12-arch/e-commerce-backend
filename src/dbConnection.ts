import mongoose from "mongoose";
import { config } from "./config";
import { winstonLogger } from "@/utils/logger";

const logger = winstonLogger('Server file', 'debug');

export const CheckDbConnection = async ():Promise<void> => {
    let isConnected = false;
    do  {
        try {
            const connection = await mongoose.connect(config.MONDODB_URI,{dbName: "e-commerce"});
            logger.info(`Database connected successfully and host is ${connection.connection.host}`);
            isConnected = true;
        } catch (error) {
            logger.error("Error connecting to MongoDB:", error);
            logger.info("Retrying Db connection");
        }
    }while (!isConnected);
}




