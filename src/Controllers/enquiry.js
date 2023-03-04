import mongoose from "mongoose";
import ParseErrors from "../utils/ParseErrors";
import Enquiry from "../models/enquiry";

exports.add_enquiry = (req,res)=>{
    const enquiry = new Enquiry({
        eno : "",
        company : req.body.company,
        name :  req.body.name,
        phone :  req.body.phone,
        email : req.body.email,
        detail : req.body.detail,
        quotationCreated : req.body.quotationCreated,
        enquiryFrom : req.body.enquiryFrom,
        date: req.body.date
    })
    enquiry.save().then((enquirydata)=>{
        res.status(201).json({enquirydata:{}})
    })
    .catch((err)=>res.status(400).json({errors:ParseErrors(err.errors)})); 
}

exports.get_enquiry = (req,res)=>{
    Enquiry.find().exec().
    then((enquirydata)=>{
        const response = {
            count:enquirydata.length,
            enquirydata:enquirydata
        }
        res.status(200).json({enquirylist:response});
    })
    .catch(()=>{
        res.status(500).json({error:{global:"something went wrong"}});
    });
}

exports.update_enquiry = (req,res) =>{
    
    const data  = req.body;
  
    const id = data._id;
    Enquiry.updateOne({_id: id}, {$set: data},{new:true}).exec().then((nnquiry)=>{
        res.status(200).json({success:{global:"Enquiry is updated successfully"}})
    }).catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}