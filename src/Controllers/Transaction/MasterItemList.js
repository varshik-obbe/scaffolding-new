import mongoose from "mongoose";
import ParseErrors from "../../utils/ParseErrors";
import MasterItemList from "../../models/masterItemList";
import Quotation from "../../models/Quotation"
import Product from "../../models/product"

exports.add_MasterItemTypeList = (req,res)=>{ 
    const data  = req.body;
    let filepath = "";	    
    if(req.file){	    
        filepath = req.file.path;	    
    }else{	    
        filepath = "";	 
    }
    const masterItemList = new MasterItemList({
        _id:mongoose.Types.ObjectId(),
        masteritemname:data.masteritemname,
        masteritemdescription:data.masteritemdescription,
        masteritemtype:data.masteritemtype,
        masteritemrate:data.masteritemrate,
        masteritemuom:data.masteritemuom,
        masteritemcostperunit:data.costperunit,
        masteritemimage:filepath,
        masteritemunitwt:data.masteritemunitwt,
        permeter:data.permeter,
        perfeet:data.perfeet,
        perinch:data.perinch,
        createdby: req.currentUser[0]._id
    })
    masterItemList.save().then((masterItemListData)=>{
        res.status(201).json({masterItemdata:{}})
    })
    .catch((err)=>{res.status(400).json({errors:ParseErrors(err.errors)})});
}

exports.get_MasterItemTypeList = (req, res) =>{
  //  MasterItemList.findByIdAndRemove("5dd6aa5dc591093e7c192d8a", function(){})
   // Quotation.findByIdAndRemove("5dd6a83ca8b7ce3874e0cac1", function(){})
  //  Product.findByIdAndRemove("5dd6a7e0a8b7ce3874e0cabe", function(){})
    MasterItemList.find()
    .populate(
        'masteritemtype masteritemuom','masteritemtypename uomname'
    )
    .exec().
    then((masteritemlistdata)=>{
        const response = {
            count:masteritemlistdata.length,
            masteritemtypelistdata:masteritemlistdata.map((masteritemlist)=>({
                id:masteritemlist._id,
                masteritemtypename:masteritemlist.masteritemname,
                masteritemdescription:masteritemlist.masteritemdescription,
                masteritemtype:masteritemlist.masteritemtype,
                masteritemrate:masteritemlist.masteritemrate,
                masteritemuom:masteritemlist.masteritemuom,
                masteritemcostperunit:parseFloat(masteritemlist.masteritemcostperunit),
                masteritemimage:masteritemlist.masteritemimage,
                masteritemunitwt:masteritemlist.masteritemunitwt,
                permeter:masteritemlist.permeter,
                perfeet:masteritemlist.perfeet,
                perinch:masteritemlist.perinch,
            }))
        }
        res.status(200).json({masteritemlist:response});
    })
    .catch((err)=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
}

exports.update_MasterItemTypeList = (req,res) =>{
    
    const data  = req.body;
    let filepath = "";	    
    if(req.file){	    
        filepath = req.file.path;	    
    }else{	    
        filepath = "";	 
    }
  //  const data  = req.body;
    
    const id = data.id;
    data.updatedby = req.currentUser[0]._id;
    if(filepath.trim().length >0) {
        data.masteritemimage=filepath;
    }
    MasterItemList.updateOne({_id: id}, {$set: data},{new:true}).exec().then((MasterItemTypeRecord)=>{
        res.status(200).json({success:{global:"Item Type is updated successfully"}})
    }).catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}

