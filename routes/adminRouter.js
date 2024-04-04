import express from 'express'
import { loginAdmin } from '../controllers/adminController.js'
const router=express.Router()
router.post('/admin_login',loginAdmin)
export default router