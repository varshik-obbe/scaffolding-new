import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const totalitemavaliableinparticularlocationSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    locationid:{type:String,required:true,ref:"Location"},
    itemid:{type:String,required:true,ref:"masteritemlist"},
    itemquantity:{type:Number}
},{ timestamps:true });

totalitemavaliableinparticularlocationSchema.plugin(uniqueValidator)

export default mongoose.model('Totalitemavaliableinlocation',totalitemavaliableinparticularlocationSchema);