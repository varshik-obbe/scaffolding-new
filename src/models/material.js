import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const materialDetailSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    materialtype:{type:String,required:true,lowecase:true,index:true,ref: "Material"},
    materialname:{type:String,required:true,lowecase:true,index:true,unique: true},
    materialdescription:{type:String,required:true,lowecase:true,index:true,unique: true},
    materialuom:{type:String,required:true,lowecase:true,index:true},
    costperunit:{type:String,required:true,lowecase:true,index:true},
    materialrate:{type:String,required:true,lowecase:true,index:true,default:1}
},{ timestamps:true });

materialDetailSchema.plugin(uniqueValidator)

export default mongoose.model('MaterialDetail',materialDetailSchema);