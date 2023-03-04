import express from "express";
import  Authentication  from "../../middleware/Authentication";
import ItemsInLocationController from "../../Controllers/Transaction/AddorUpdateInLocation";

const router = express.Router();

router.post('/addorupdateitems',Authentication, ItemsInLocationController.addorupdate_Items);
router.post('/additems',Authentication, ItemsInLocationController.add_Items);
router.delete('/deleteitems',Authentication, ItemsInLocationController.delete_Items);
router.get('/getitemlistavaliable',Authentication,ItemsInLocationController.get_ItemsList);

export default router;