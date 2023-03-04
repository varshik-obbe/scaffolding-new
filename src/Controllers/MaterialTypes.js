import mongoose from "mongoose";
import ParseErrors from "../utils/ParseErrors";
import Material from "../models/materialType";


exports.get_materialTypes = (req,res)=>{
    Material.find().exec().
    then((materialsdata)=>{
        const response = {
            count:materialsdata.length,
            materialsdata:materialsdata.map((materialdata)=>({
                id:materialdata._id,
                materialname:materialdata.materialname
            }))
        }
        res.status(200).json({materiallist:response});
    })
    .catch(()=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
}

exports.add_materialTypes = (req,res)=>{
    const { data } = req.body;
    const material = new Material({
        _id:mongoose.Types.ObjectId(),
        materialname:data.material,
    })
    material.save().then(()=>res.status(201).json({materialdata:{}}))
    .catch((err)=>res.status(400).json({errors:ParseErrors(err.errors)}));
}

exports.update_materialTypes = (req,res)=>{
    const id = req.query.id;
    const { data } = req.body;
    Material.updateOne({_id: id}, {$set: data}).exec().then((MaterialRecord)=>{
        res.status(200).json({success:{global:"Material Type is updated successfully"}})
    }).catch(()=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}