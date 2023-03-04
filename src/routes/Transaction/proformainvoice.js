import express from "express";
import  Authentication  from "../../middleware/Authentication";
import ProformaInvoiceController from "../../Controllers/Transaction/ProformaInvoice";

const router = express.Router();

router.post('/addproformainvoice',Authentication, ProformaInvoiceController.add_ProformaInvoice);

router.get('/getproformainvoice',Authentication, ProformaInvoiceController.get_ProformaInvoice);

router.get('/getsingleproformainvoice/:id',Authentication, ProformaInvoiceController.get_SingleProformaInvoice);

router.post('/updateproformainvoice',Authentication, ProformaInvoiceController.update_proformainvoice);


export default router;