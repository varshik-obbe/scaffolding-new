import express from "express";
import  Authentication  from "../middleware/Authentication";
import ProductController from "../Controllers/Product";

const router = express.Router();


router.post('/addproduct',Authentication, ProductController.add_Product);

router.get('/getproducts', ProductController.get_Product);
router.get('/getproduct/:id', Authentication, ProductController.get_SingleProduct);
router.patch("/updateproduct",Authentication,ProductController.update_product);
router.delete("/deleteproduct",Authentication,ProductController.delete_product);

export default router;