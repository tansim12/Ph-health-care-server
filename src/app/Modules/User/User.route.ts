
import express from 'express';
import { userController } from './User.controller';

const router = express.Router()

router.get("/", userController.getAllUsers)
router.post("/", userController.createUser)
router.post("/create-admin", userController.adminCreate)

export const userRouter = router