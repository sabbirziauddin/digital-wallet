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

// Graceful shutdown for unhandled errors
const unexpectedErrorHandler = (error: unknown) => {
    console.error("UNEXPECTED ERROR:", error);
    if (server) {
        console.log("Server is closing...");
        server.close(() => {
            process.exit(1); // Exit with failure code
        });
    } else {
        process.exit(1);
    }
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", (reason) => {
    // Throwing the error so uncaughtException handler can deal with it
    // This ensures consistent handling and logging for all unexpected errors.
    throw reason;
});