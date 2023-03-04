import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const enquirySchema = new mongoose.Schema({
    eno : {type:String},
    company : {type:String},
    name :  {type:String},
    phone :  {type:Number},
    email : {type:String},
    detail : {type:String},
    quotationCreated : {type:Boolean},
    enquiryFrom : {type:String},
    quoteno : {type:String},
    date: {type:String}
},{ timestamps:true });

enquirySchema.plugin(uniqueValidator)

export default mongoose.model('Enquiry',enquirySchema);