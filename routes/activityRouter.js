import express from "express"
import { upload } from "../multer.js"
import { activityDetails, addActivity, deleteAactivity, destinationBasedActivityDetails, singleactivityDetails, updateActivity } from "../controllers/activityController.js"
const router=express.Router()
router.post("/addActivity",upload.single('image'),addActivity)
router.get("/activityDetails",activityDetails)
router.get("/destinationBasedActivity/:packageId",destinationBasedActivityDetails)
router.get("/singleActivityDetails/:activityId",singleactivityDetails)
router.post("/editActivity/:activityId",upload.single('image'),updateActivity)
router.delete("/removeActivity/:activityId",deleteAactivity)
export default router 