import express from 'express';
import { adminController } from './Admin.controller';

const router = express.Router()

router.get("/",adminController.findAllAdmin)



export const adminRouter = router 


