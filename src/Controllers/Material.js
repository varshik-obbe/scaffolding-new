import mongoose from "mongoose";
import ParseErrors from "../utils/ParseErrors";
import Material from "../models/material";

exports.add_material = (req,res)=>{
    const { data } = req.body;
    const material = new Material({
        _id:mongoose.Types.ObjectId(),
        materialtype:data.materialtype,
        materialname:data.materialname,
        materialdescription:data.materialdescription,
        materialuom:data.materialuom,
        costperunit:data.costperunit,
        materialrate:data.materialrate
    })
    material.save().then(()=>res.status(201).json({materialdata:{}}))
    .catch((err)=>res.status(400).json({errors:ParseErrors(err.errors)}));
}

exports.get_material = (req,res)=>{
    Material.find()
    .populate('materialtype','materialname')
    .exec().
    then((materialsdata)=>{
        const response = {
            count:materialsdata.length,
            materialsdata:materialsdata.map((materialdata)=>({
                id:materialdata._id,
                materialtype:materialdata.materialtype,
                materialname:materialdata.materialname,
                materialdescription:materialdata.materialdescription,
                materialuom:materialdata.materialuom,
                costperunit:materialdata.costperunit,
                materialrate:materialdata.materialrate
            }))
        }
        res.status(200).json({materiallist:response});
    })
    .catch((err)=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
}

exports.update_material = (req,res)=>{
    const id = req.query.id;
    const { data } = req.body;
    Material.updateOne({_id: id}, {$set: data}).exec().then((MaterialRecord)=>{
        res.status(200).json({success:{global:"Material details is updated successfully"}})
    }).catch(()=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}