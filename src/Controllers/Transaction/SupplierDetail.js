import mongoose from "mongoose";
import async from "async";
import ParseErrors from "../../utils/ParseErrors";
import SupplierDetail from "../../models/supplierlist";

exports.add_SupplierDetail = (req,res)=>{
    const { data } = req.body;
    const supplierDetail = new SupplierDetail({
        _id:mongoose.Types.ObjectId(),
        suppliernumber:data.suppliernumber,
        suppliername:data.suppliername,
        supplieraddress1:data.supplieraddress1,
        supplieraddress2:data.supplieraddress2,
        city:data.city,
        pincode:data.pincode,
        state:data.state,
        country:data.country,
        suppliergstnumber:data.suppliergstnumber,
        supplierContactList:data.supplierContactinfo,
        createdby: req.currentUser[0]._id
    })
    supplierDetail.save().then((supplierdetaildata)=>{
        res.status(201).json({supplierDetaildata:{}})
    })
    .catch((err)=>{res.status(400).json({errors:ParseErrors(err.errors)})});    
}

exports.get_SupplierDetail = (req,res)=>{
    SupplierDetail.find()
    .exec().
    then((supplierdetaildata)=>{
        const response = {
            count:supplierdetaildata.length,
            supplierdetaillistdata:supplierdetaildata.map((supplierdetail)=>({
                id:supplierdetail._id,
                suppliernumber:supplierdetail.suppliernumber.toString(),
                suppliername:supplierdetail.suppliername,
                supplieraddress1:supplierdetail.supplieraddress1,
                supplieraddress2:supplierdetail.supplieraddress2,
                city:supplierdetail.city,
                pincode:supplierdetail.pincode.toString(),
                state:supplierdetail.state,
                country:supplierdetail.country,
                suppliergstnumber:supplierdetail.suppliergstnumber,
                suppliercontactlistvalue:supplierdetail.supplierContactList
            }))
        }
        res.status(200).json({supplierdetaillist:response});
    })
    .catch((err)=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
}


exports.update_SupplierDetail = (req,res) =>{
    const id = req.query.id;
    const { data } = req.body;
    const objitems = { 
        suppliernumber:data.suppliernumber, 
        suppliername:data.suppliername,
        supplieraddress1:data.supplieraddress1,
        supplieraddress2:data.supplieraddress2,
        city:data.city,
        pincode:data.pincode,
        state:data.state,
        country:data.country,
        suppliergstnumber:data.suppliergstnumber,
        updatedby: req.currentUser[0]._id
    }
    const contactinfo = data.supplierContactinfo;
    SupplierDetail.findOneAndUpdate({_id: id}, {$set: objitems}, {new: true}).exec()
    .then((updateddata)=>{
        if(contactinfo.length > 0){
            contactinfo.forEach((item)=>{
                if(item.id === null){
                    updateddata.supplierContactList.push(item);
                    updateddata.save();
                }else if(item.id){
                    return SupplierDetail.updateOne(
                        {
                            _id:id,
                            "supplierContactList._id":item.id
                        },
                        {
                            $set:
                            { 
                                "supplierContactList.$.suppliercontactname": item.suppliercontactname,
                                "supplierContactList.$.suppliercontactdesignation": item.suppliercontactdesignation,
                                "supplierContactList.$.suppliercontactnumber": item.suppliercontactnumber,
                                "supplierContactList.$.suppliercontactemail": item.suppliercontactemail
                            }
                        }
                    ).exec()
                }
            });
        }
    })
    .then((updateddata)=>{
        console.log("___EXECUTION__TIME__");
        res.status(200).json({success:{}});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json({error:{global:"something went wrong"}});
    })
    
}


