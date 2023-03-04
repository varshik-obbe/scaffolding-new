import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const MasterItemListSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    masteritemname:{type:String,required:true,lowecase:true,index:true,unique: true},
    masteritemdescription:{type:String,required:true,lowecase:true,index:true},
    masteritemtype:{type:String,required:true,lowecase:true,index:true,ref: "masteritemtype"},
    masteritemrate:{type:String,lowecase:true,index:true, default:null},
    masteritemuom:{type:String,required:true,lowecase:true,index:true,ref: "Uom"},
    masteritemcostperunit:{type:String,sparse: true,default:null},
    masteritemimage:{type:String,lowecase:true,index:true,default:null},
    createdby:{type:String,required:true,lowecase:true,index:true},
    updatedby:{type:String,lowecase:true,index:true,default:null},
    masteritemunitwt:{type:String,lowecase:true,index:true,default:null},
    permeter:{type:String,default:null},
    perfeet:{type:String,default:null},
    perinch:{type:String,default:null},
},{ timestamps:true });

MasterItemListSchema.plugin(uniqueValidator)

export default mongoose.model('masteritemlist',MasterItemListSchema);