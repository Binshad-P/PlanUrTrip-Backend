import express from 'express'
import { orders, loginUser, signupUser, userDetails, userProfile, success, sendOTP, verifyOTP } from '../controllers/userController.js'
import { userToken } from '../middleware/middleware.js'



const router=express.Router()
router.post("/signup",signupUser)
router.post('/login',loginUser)
router.get('/userDetails',userDetails)
router.get('/profile',userToken,userProfile)
router.post('/orders',orders)
router.post('/success',success)

router.post('/sendOTP',sendOTP);
router.post('/verifyOTP', verifyOTP);

export default router