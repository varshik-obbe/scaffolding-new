import express from "express";
import  Authentication  from "../../middleware/Authentication";
import MasterItemTypeController from "../../Controllers/Transaction/MasterItemType";

const router = express.Router();

// Authentication
router.post('/addmasteritemtype', MasterItemTypeController.add_MasterItemType);

router.get('/getmasteritemtype',Authentication, MasterItemTypeController.get_MasterItemType);

router.patch('/updatemasteritemtype',Authentication, MasterItemTypeController.update_MasterItemType);

export default router;