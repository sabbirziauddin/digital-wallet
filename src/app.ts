import { Request, Response } from "express";
import { globalErrorHandlers } from "./app/middlewares/globalErrorHandlers";

const express = require('express');

let app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("From digital waallet app")

})
//global error handler 
app.use(globalErrorHandlers);
export default app;