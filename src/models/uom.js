import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const uomSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    uomname:{type:String,required:true,lowecase:true,index:true,unique: true},
    uomdescription:{type:String,lowecase:true,index:true,default:null}
},{ timestamps:true });

uomSchema.plugin(uniqueValidator)

export default mongoose.model('Uom',uomSchema);