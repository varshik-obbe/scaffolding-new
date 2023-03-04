import express from "express";
import  Authentication  from "../middleware/Authentication";
import CurrencyController from "../Controllers/Currency";

const router = express.Router();


router.post('/addcurrency',Authentication, CurrencyController.add_Currency);

router.get('/getcurrency',Authentication, CurrencyController.get_Currency);

export default router;