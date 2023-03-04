import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const locationSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    locationname:{type:String,required:true,lowecase:true,index:true,unique: true},
    locationdescription:{type:String,lowecase:true,index:true,default:null}
},{ timestamps:true });

locationSchema.plugin(uniqueValidator)

export default mongoose.model('Location',locationSchema);