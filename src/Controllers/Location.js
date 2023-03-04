import mongoose from "mongoose";
import ParseErrors from "../utils/ParseErrors";
import Location from "../models/location";

exports.add_Location = (req,res)=>{
    const { data } = req.body;
    const location = new Location({
        _id:mongoose.Types.ObjectId(),
        locationname:req.body.locationname,
        locationdescription:req.body.locationdescription
    })
    location.save().then((locationdata)=>{
        res.status(201).json({locationdata:{}})
    })
    .catch((err)=>res.status(400).json({errors:ParseErrors(err.errors)})); 
}

exports.delete_Location = (req,res)=>{
    Location.deleteOne({_id: "5e6925c1bbd92719e495d1a4"},function(err,data){
        if(err){
            res.send('error');
        }
        console.log(data);
        return res.send('success')
    })
}

exports.get_Location = (req,res)=>{
    Location.find().exec().
    then((locationdata)=>{
        const response = {
            count:locationdata.length,
            locationdata:locationdata.map((data)=>({
                id:data._id,
                locationname:data.locationname
            }))
        }
        res.status(200).json({locationlist:response});
    })
    .catch(()=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });

    // Location.remove({},function(err,data){
    //     return res.send('success')
    // })
}