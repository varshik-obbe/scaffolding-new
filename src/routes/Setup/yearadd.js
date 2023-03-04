import express from "express";
import YearController from "../../Controllers/Setup/addYear";
import Authentication from "../../middleware/Authentication";

const router = express.Router();


router.post('/addyear',Authentication, YearController.add_Year);

router.get('/getyear',Authentication, YearController.check_exists);

 router.patch('/updateyear',Authentication, YearController.update_year);

export default router;