import mongoose from "mongoose";
import ParseErrors from "../../utils/ParseErrors";
import MasterItemList from "../../models/masterItemList";
import Quotation from "../../models/Quotation"
import Product from "../../models/product"

exports.add_MasterItemTypeList = (req,res)=>{ 
    const data  = req.body;
    let filepath = "";	   
    let secondimage = ""; 
    if(req.files){	    
        filepath = req.files.imagefile[0].path;	    
    }else{	    
        filepath = "";	 
    }
    if(req.files.secondimage){	    
        secondimage = req.files.secondimage[0].path;	    
    }else{	    
        secondimage = "";	 
    }
    const masterItemList = new MasterItemList({
        _id:mongoose.Types.ObjectId(),
        masteritemname:data.masteritemname,
        itemName: data.itemName,
        masteritemdescription:data.masteritemdescription,
        masteritemshortdescription:data.masteritemshortdescription,
        masteritemtype:data.masteritemtype,
        masteritemrate:data.masteritemrate,
        masteritemuom:data.masteritemuom,
        masteritemcostperunit:data.costperunit,
        masteritemimage:filepath,
        masteritemsecondimage:secondimage,
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
                itemName: masteritemlist.itemName,
                masteritemdescription:masteritemlist.masteritemdescription,
                masteritemshortdescription:masteritemlist.masteritemshortdescription,
                masteritemtype:masteritemlist.masteritemtype,
                masteritemrate:masteritemlist.masteritemrate,
                masteritemuom:masteritemlist.masteritemuom,
                masteritemcostperunit:parseFloat(masteritemlist.masteritemcostperunit),
                masteritemimage:masteritemlist.masteritemimage,
                masteritemsecondimage:masteritemlist.masteritemsecondimage,
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
    let secondimage = "";   
    if(req.files){	    
        filepath = req.files.imagefile[0].path;;	    
    }else{	    
        filepath = "";	 
    }
    if(req.files.secondimage){	    
        secondimage = req.files.secondimage[0].path;	    
    }else{	    
        secondimage = "";	 
    }
  //  const data  = req.body;
    
    const id = data.id;
    data.updatedby = req.currentUser[0]._id;
    if(filepath.trim().length >0) {
        data.masteritemimage=filepath;
    }
    if(secondimage.trim().length >0) {
        data.masteritemsecondimage=secondimage;
    }
    MasterItemList.updateOne({_id: id}, {$set: data},{new:true}).exec().then((MasterItemTypeRecord)=>{
        res.status(200).json({success:{global:"Item Type is updated successfully"}})
    }).catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}

exports.delete_MasterItemTypeList = (req,res) => {
    const id = req.query.id;
    console.log("id is", id)
    MasterItemList.deleteOne({_id: id.toString()}, function(err,data) {
        if(!err) {
            console.log("deleted data is",data)
            res.status(200).json({success:{global:"Item deleted successfully"}})
        }
        else {
            console.log("error is",err)
            res.status(400).json({error:{global:"something went wrong"}});
        }
    })
}

