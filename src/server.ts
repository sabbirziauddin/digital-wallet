import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
let server: any;
const PORT = process.env.PORT
const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);
        console.log("database connected successfully");
        server = app.listen(PORT, () => {
            console.log(`app is running on port ${PORT}`);
        })

    } catch (error) {
        console.log("failed to connect database", error);

    }

}
startServer();