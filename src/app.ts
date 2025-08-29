import { Request, Response } from "express";

const express = require('express');

let app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("From digital waallet app")

})

export default app;