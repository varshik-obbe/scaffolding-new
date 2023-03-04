import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const suppliercontactlistSchema = new mongoose.Schema({
    suppliercontactname:{type:String,lowecase:true,index:true},
    suppliercontactdesignation:{type:String,lowecase:true,index:true},
    suppliercontactnumber:{type:Number,lowecase:true,index:true},
    suppliercontactemail:{type:String,lowecase:true,index:true}
});
const supplierContactSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    suppliernumber:{type:Number,required:true,lowecase:true,index:true,unique: true},
    suppliername:{type:String,required:true,lowecase:true,index:true},
    supplieraddress1:{type:String,required:true,lowecase:true,index:true},
    supplieraddress2:{type:String,required:true,lowecase:true,index:true},
    city:{type:String,required:true,lowecase:true,index:true},
    pincode:{type:Number,required:true,lowecase:true,index:true},
    state:{type:String,required:true,lowecase:true,index:true},
    country:{type:String,required:true,lowecase:true,index:true},
    suppliergstnumber:{type:String,required:true,lowecase:true,index:true},
    supplierContactList:[suppliercontactlistSchema, { ref:"Purchaseorder"} ],
    status:{type:String,lowecase:true,index:true,default:null},
    createdby:{type:String,lowecase:true,index:true,default:null},
    updatedby:{type:String,lowecase:true,index:true,default:null},
},{ timestamps:true });

supplierContactSchema.plugin(uniqueValidator)

export default mongoose.model('Supplierlist', supplierContactSchema);