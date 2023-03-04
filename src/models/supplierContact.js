import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const supplierContactSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    suppliercontactname:{type:String,required:true,lowecase:true,index:true},
    suppliercontactnumber:{type:Number,required:true,lowecase:true,index:true,unique: true},
    status:{type:String,lowecase:true,index:true,default:null},
    createdby:{type:String,lowecase:true,index:true,default:null},
    updatedby:{type:String,lowecase:true,index:true,default:null},
},{ timestamps:true });

supplierContactSchema.plugin(uniqueValidator)

export default mongoose.model('Suppliercontact', supplierContactSchema);