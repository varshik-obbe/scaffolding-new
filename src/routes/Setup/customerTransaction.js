import express from "express";
import  Authentication  from "../../middleware/Authentication";
import CustomerTransactionController from "../../Controllers/Setup/customerTransaction";

const router = express.Router();

// Authentication
router.post('/addcustomertransaction', CustomerTransactionController.add_CustomerTransaction);

router.get('/getcustomertransaction/:id', CustomerTransactionController.get_CustomerTransaction);

router.put('/updatecustomertransaction', CustomerTransactionController.update_CustomerTransaction);

export default router;