import express from "express";
import  Authentication  from "../../middleware/Authentication";
import InvoiceController from "../../Controllers/Transaction/Invoice";

const router = express.Router();

router.post('/addinvoice',Authentication, InvoiceController.add_Invoice);

router.get('/getinvoice',Authentication, InvoiceController.get_Invoice);

router.get('/getsingleinvoice/:id',Authentication, InvoiceController.get_SingleInvoice);

router.post('/updateinvoice',Authentication, InvoiceController.update_invoice);


export default router;