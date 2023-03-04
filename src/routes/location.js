import express from "express";
import  Authentication  from "../middleware/Authentication";
import LocationController from "../Controllers/Location";

const router = express.Router();


router.post('/addlocation', LocationController.add_Location);
router.get('/getlocation', Authentication, LocationController.get_Location);
router.delete('/deletelocation', LocationController.delete_Location);

export default router;