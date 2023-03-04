import express from "express";
import  Authentication  from "../../middleware/Authentication";
import ReceiptInfoController from "../../Controllers/Transaction/Receiptinfo";

const router = express.Router();

router.get('/getreceiptinfolist',Authentication, ReceiptInfoController.get_Receiptinfo);

export default router;