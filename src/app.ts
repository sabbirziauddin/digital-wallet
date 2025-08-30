import { Request, Response } from "express";
import { globalErrorHandlers } from "./app/middlewares/globalErrorHandlers";
import { NotFound } from "./app/middlewares/NotFound";
import { router } from "./app/routes";
import cors from "cors";
const express = require('express');

let app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("From digital waallet app")

})
app.use("/api/v1", router)
//global error handler 
app.use(globalErrorHandlers);
app.use(NotFound)
export default app;