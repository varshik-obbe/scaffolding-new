import mongoose from "mongoose";
import ParseErrors from "../utils/ParseErrors";
import User from "../models/user";

exports.auth = (req,res)=>{
    const { userRegisterdata } = req.body;
    const user = new User({
        _id:mongoose.Types.ObjectId(),
        title:userRegisterdata.title,
        firstname:userRegisterdata.firstname,
        lastname:userRegisterdata.lastname,
        email:userRegisterdata.email,
        phone:userRegisterdata.phone,
        startdate:userRegisterdata.startdate,
        enddate:userRegisterdata.enddate,
        username:userRegisterdata.username,
        active:userRegisterdata.active,
        persontype:userRegisterdata.persontype,
        second_persontype:userRegisterdata.second_persontype,
        department:userRegisterdata.department,
        job:userRegisterdata.job,
        location:userRegisterdata.location,
        createdby: req.currentUser[0]._id
    })
    user.setPassword(userRegisterdata.password)
    user.save().then((userRecord)=>res.status(201).json({userRecord}))
    .catch((err)=>res.status(400).json({errors:ParseErrors(err.errors)}));
}

exports.login = (req, res)=>{
    const { credentials } = req.body;
    const todayDate = new Date();
    
    User.findOne({email: credentials.email }).exec().then((UserRecord)=>{
        if(UserRecord && UserRecord.isValidPassword(credentials.password)){
            res.status(200).json({user:UserRecord.toAuthJSON()});
            
        }else{
            res.status(400).json({errors:{global:"invalid credentials"}});
        }
    }).catch((err) => 
    {
        console.log(err)
        res.status(400).json({errors:{global:"invalid credentials"}})

    }
    );
}

exports.getUser = (req,res)=>{
    User.find()
    .exec()
    .then((userdata)=>{
        const response = {
            count:userdata.length,
            userdata: userdata.map((user)=>({
                    id:user._id,
                    title:user.title,
                    firstname: user.firstname,
                    lastname:user.lastname,
                    email: user.email,
                    phone: user.phone,
                    startdate:user.startdate,
                    enddate:user.enddate,
                    username:user.username,
                    persontype:user.persontype,
                    second_persontype:user.second_persontype,
                    active:user.active ,
                    department:user.department,
                    job:user.job,
                    location:user.location
                }))
        }
        res.status(200).json({userdata:response});
    })
    .catch(()=>{
        res.status(500).json({error:{global:"something went wrong"}});
    }); 
}

exports.getUserById = (req,res)=>{
    const id = req.query.id;
    User.findById(id).select('-password -createdAt -updatedAt -__v').exec().then((userRecordData)=>{
        res.status(200).json({userRecordData})
    }).catch((err)=>{
        res.status(404).json({error:{global:"not found"}});
    });
}

exports.updateUser = (req,res)=>{
    const id = req.query.id;
    const { data } = req.body;
    data.updatedby = req.currentUser[0]._id;
    User.updateOne({_id: id}, {$set: data}).exec().then((userRecord)=>{
        res.status(200).json({success:{global:"User details is updated successfully"}})
    }).catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}

exports.deleteUser = (req,res)=>{
    const id = req.query.id;
    console.log("id is", id)
    User.deleteOne({_id: id.toString()}, function(err,data) {
        if(!err) {
            console.log("deleted data is",data)
            res.status(200).json({success:{global:"User deleted successfully"}})
        }
        else {
            console.log("error is",err)
            res.status(400).json({error:{global:"something went wrong"}});
        }
    })
}