import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const materialSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    materialname:{type:String,required:true,lowecase:true,index:true,unique: true}
},{ timestamps:true });

materialSchema.plugin(uniqueValidator)

export default mongoose.model('Material',materialSchema);