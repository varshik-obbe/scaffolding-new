import express from "express";
import  Authentication  from "../middleware/Authentication";
import UomController from "../Controllers/Uom";

const router = express.Router();

// Authentication
router.post('/adduom', UomController.add_Uom);

router.get('/getuom',Authentication, UomController.get_Uom);

export default router;