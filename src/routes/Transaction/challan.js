import express from "express";
import  Authentication  from "../../middleware/Authentication";
import ChallanController from "../../Controllers/Transaction/DeliveryChallan";

const router = express.Router();

router.post('/addchallan',Authentication, ChallanController.add_Challan);

router.get('/getchallan',Authentication, ChallanController.get_Challan);

router.get('/getsinglechallan/:id',Authentication, ChallanController.get_SingleChallan);

router.post('/updatechallan',Authentication, ChallanController.update_challan);

export default router;