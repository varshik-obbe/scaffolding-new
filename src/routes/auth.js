import express from "express";
import  Authentication  from "../middleware/Authentication";
import UserController from "../Controllers/User";

const router = express.Router()

router.post('/auth',Authentication, UserController.auth);

router.post('/login',UserController.login);

router.get("/getuser",UserController.getUser);

router.get("/getuserbyid",Authentication, UserController.getUserById);

router.patch("/updateuser",Authentication, UserController.updateUser);

router.delete("/deleteUser",Authentication, UserController.deleteUser);


export default router;