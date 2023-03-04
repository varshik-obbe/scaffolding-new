import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const MasterItemTypeSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    masteritemtypename:{type:String,required:true,lowecase:true,index:true,unique: true},
    createdby:{type:String,lowecase:true,default:null},
    updatedby:{type:String,lowecase:true,default:null}
},{ timestamps:true });

MasterItemTypeSchema.plugin(uniqueValidator)

export default mongoose.model('masteritemtype',MasterItemTypeSchema);