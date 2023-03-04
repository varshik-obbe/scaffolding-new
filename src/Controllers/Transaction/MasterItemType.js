import mongoose from "mongoose";
import ParseErrors from "../../utils/ParseErrors";
import MasterItemType from "../../models/masteritemtype";

exports.add_MasterItemType = (req,res)=>{
    const { data } = req.body; 
    const masterItemType = new MasterItemType({
        _id:mongoose.Types.ObjectId(),
        masteritemtypename:req.body.itemtype,
        createdby: "admin@gmail.com"
    })
    masterItemType.save().then((masterItemTypeData)=>{
        res.status(201).json({masterItemdata:{}})
    })
    .catch((err)=>{res.status(400).json({errors:ParseErrors(err.errors)})});
}

exports.get_MasterItemType = (req,res)=>{
    MasterItemType.find().exec().
    then((masteritemdata)=>{
        const response = {
            count:masteritemdata.length,
            masteritemtypenamedata:masteritemdata.map((masteritemtypedata)=>({
                id:masteritemtypedata._id,
                masteritemtypename:masteritemtypedata.masteritemtypename,
            }))
        }
        res.status(200).json({masteritemtypes:response});
    })
    .catch(()=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
    
}

exports.update_MasterItemType = (req,res) =>{
    const id = req.query.id;
    const { data } = req.body;
    data.updatedby = req.currentUser[0]._id;
    MasterItemType.updateOne({_id: id}, {$set: data}).exec().then((MasterItemTypeRecord)=>{
        res.status(200).json({success:{global:"Item Type is updated successfully"}})
    }).catch(()=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}