import express from "express";
import EnquiryController from "../Controllers/enquiry";

const router = express.Router();

router.post('/addenquiry',EnquiryController.add_enquiry);

router.get('/getenquiry',EnquiryController.get_enquiry);
router.post('/updateenquiry',EnquiryController.update_enquiry);

export default router;