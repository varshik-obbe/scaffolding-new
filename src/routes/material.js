import express from "express";
import  Authentication  from "../middleware/Authentication";
import MaterialController from "../Controllers/Material";

const router = express.Router();

router.post('/addmaterial',Authentication, MaterialController.add_material);
router.get('/getmaterials',Authentication,MaterialController.get_material);
router.patch("/updatematerial",Authentication,MaterialController.update_material);


export default router;