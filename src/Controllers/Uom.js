import mongoose from "mongoose";
import ParseErrors from "../utils/ParseErrors";
import Uom from "../models/uom";

exports.add_Uom = (req,res)=>{
    const { data } = req.body;
    const product = new Uom({
        _id:mongoose.Types.ObjectId(),
        uomname:req.body.uomname,
        uomdescription:req.body.uomdescription
    })
    product.save().then((uomdata)=>{
        res.status(201).json({uomdata:{}})
    })
    .catch((err)=>res.status(400).json({errors:ParseErrors(err.errors)})); 
}

exports.get_Uom = (req,res)=>{
    Uom.find().exec().
    then((uomdata)=>{
        const response = {
            count:uomdata.length,
            uomdata:uomdata.map((data)=>({
                id:data._id,
                uomname:data.uomname
            }))
        }
        res.status(200).json({uomlist:response});
    })
    .catch(()=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
}