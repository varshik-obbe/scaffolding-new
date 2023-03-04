import express from "express";
import  Authentication  from "../middleware/Authentication";
import MaterialTypeController from "../Controllers/MaterialTypes";

const router = express.Router();

router.post('/addmaterial',Authentication, MaterialTypeController.add_materialTypes);
router.get('/getmaterials',Authentication,MaterialTypeController.get_materialTypes);
router.patch("/updatematerialtype",Authentication,MaterialTypeController.update_materialTypes);

export default router;