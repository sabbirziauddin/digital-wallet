import { Router } from "express";
import path from "path";

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route:"",
    },

]

moduleRoutes.forEach((route) => {
    router.use(route.path, )
})

