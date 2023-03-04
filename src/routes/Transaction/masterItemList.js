import express from "express";
import multer from "multer";
import  Authentication  from "../../middleware/Authentication";
import MasterItemListController from "../../Controllers/Transaction/MasterItemList";

const router = express.Router();
const getFeild = multer();

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, './uploads/');
    },
    
    filename(req,file,cb){
        cb(null, Date.now() + file.originalname)
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'|| file.mimetype === 'image/svg'|| file.mimetype === 'image/jpg'|| file.mimetype === 'image/gif'){
       cb(null,true);
    }else{
       cb(null, false);
    }
}

const upload = multer({
    storage,
    limits:{
        fileSize: 1024*1024*5
    },
    fileFIlter:fileFilter
});

router.post('/addmasteritemlist',Authentication, upload.single("imagefile"), MasterItemListController.add_MasterItemTypeList);
//Authentication
router.get('/getmasteritemlist', MasterItemListController.get_MasterItemTypeList);

router.patch('/updatemasteritemlist',Authentication,upload.single("imagefile"), MasterItemListController.update_MasterItemTypeList);

export default router;