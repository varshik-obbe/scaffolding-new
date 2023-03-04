import express from "express";
import  Authentication  from "../../middleware/Authentication";
import CustomerController from "../../Controllers/Setup/customerContact";

const router = express.Router();


router.post('/addcustomer',Authentication, CustomerController.add_Customer);

router.get('/getcustomer',Authentication, CustomerController.get_Customer);

router.patch('/updatecustomer',Authentication, CustomerController.update_Customer);

export default router;