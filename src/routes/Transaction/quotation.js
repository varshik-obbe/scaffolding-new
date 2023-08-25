import express from "express";
import  Authentication  from "../../middleware/Authentication";
import QuotationController from "../../Controllers/Transaction/Quotation";

const router = express.Router();

router.post('/addquotation',Authentication, QuotationController.add_Quotation);

router.post('/getquotno',Authentication, QuotationController.getquotno);

router.get('/getquotation',Authentication, QuotationController.get_Quotation);

router.get('/getsinglequotation/:id',Authentication, QuotationController.get_singleQuotation);

router.post('/updatequotation',Authentication, QuotationController.update_quotation);

router.get('/generatequotaionPDF/:id',QuotationController.generate_pdf);


export default router;