import express from "express";
import  Authentication  from "../../middleware/Authentication";
import SupplierDetailController from "../../Controllers/Transaction/SupplierDetail";

const router = express.Router();

router.post('/addSupplierdetail',Authentication, SupplierDetailController.add_SupplierDetail);

router.get('/getSupplierdetail',Authentication, SupplierDetailController.get_SupplierDetail);

router.patch('/updateSupplierdetail', Authentication, SupplierDetailController.update_SupplierDetail);

export default router;