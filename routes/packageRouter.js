import express from "express"
import { addPackage, deletePackage, packageDetails, seasonDestination, singlePackageDetails, updatePackage } from "../controllers/packageController.js"
import { upload } from "../multer.js"
const router=express.Router()
router.post("/addPackage",upload.array('images', 5),addPackage)
router.get('/packageDetails',packageDetails)
router.get("/singlePackageDetails/:packageId",singlePackageDetails)
router.put("/updatePackage/:packageId",upload.array('images', 5),updatePackage)
router.delete("/deletePackage/:packageId",deletePackage)
router.get('/seasonDestination',seasonDestination)
export default router