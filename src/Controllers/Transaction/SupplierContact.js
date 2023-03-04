import mongoose from "mongoose";
import ParseErrors from "../../utils/ParseErrors";
import SupplierContact from "../../models/supplierContact";

exports.add_SupplierContact = (req,res)=>{
    const { data } = req.body;
    const supplierContact = new SupplierContact({
        _id:mongoose.Types.ObjectId(),
        suppliercontactname:data.suppliercontactname,
        suppliercontactnumber:data.suppliercontactnumber,
        createdby: req.currentUser[0]._id
    })
    supplierContact.save().then((supplierdata)=>{
        res.status(201).json({supplierContactdata:{}})
    })
    .catch((err)=>{ res.status(400).json({errors:ParseErrors(err.errors)})});    
}

exports.get_SupplierContact = (req,res)=>{
    SupplierContact.find().exec().
    then((suppliercontactdata)=>{
        const response = {
            count:suppliercontactdata.length,
            suppliercontactlistdata:suppliercontactdata.map((suppliercontact)=>({
                id:suppliercontact._id,
                suppliercontactname:suppliercontact.suppliercontactname,
                suppliercontactnumber:suppliercontact.suppliercontactnumber
            }))
        }
        res.status(200).json({suppliercontactlist:response});
    })
    .catch(()=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
    
}
