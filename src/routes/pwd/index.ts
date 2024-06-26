import express, { Router } from "express"
import { authenticate, register } from "./controller/controller"
import config from "../../config/default"
import { validateAuthObj } from "./middleware/middleware"


const router = Router()

// Set middleware functions
router.use(express.urlencoded({ extended: true, limit: config.PWD_PAYLOAD_LIMIT }))

// Define routes
router.post("/auth", validateAuthObj, authenticate)

router.post("/signup", register)

export default router