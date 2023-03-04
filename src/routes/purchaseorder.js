import express from "express";
import  Authentication  from "../middleware/Authentication";
import PurchaseOrderController from "../Controllers/Transaction/PurchaseOrder";

const router = express.Router();


router.post('/addpurchaseorder',Authentication, PurchaseOrderController.add_PurchaseOrder);

router.get('/getpurchaseorderrlist',Authentication, PurchaseOrderController.get_PurchaseOrder);

router.get('/searchpurchaseorderrlist',Authentication, PurchaseOrderController.search_PurchaseOrder);

router.get('/getpurchaseorder/:id', Authentication, PurchaseOrderController.get_SinglePurchaseOrder);

router.post('/updatepo',Authentication, PurchaseOrderController.update_po);


export default router;