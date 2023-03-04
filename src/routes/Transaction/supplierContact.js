import express from "express";
import  Authentication  from "../../middleware/Authentication";
import SupplierContactController from "../../Controllers/Transaction/SupplierContact";

const router = express.Router();

router.post('/addSupplierContact',Authentication, SupplierContactController.add_SupplierContact);

router.get('/getSupplierContact',Authentication, SupplierContactController.get_SupplierContact);

export default router;