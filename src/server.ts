import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
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
(async () => {
    await startServer()
    await seedSuperAdmin()
})()

//unhandle exeption
process.on("uncaughtException", (error) => {
    if (server) {
        console.log("Uncaught Exception: ", error);
        process.exit(1); // Exit the process with failure
    }
    process.exit(1); // Exit the process with success
});

//Promise.reject(new Error("I forgot to catch this uncaught exception"));
process.on("unhandledRejection", (error) => {
    if (server) {
        console.log("uncaught rejection", error);
        process.exit(1);
    }
    process.exit(1);
});