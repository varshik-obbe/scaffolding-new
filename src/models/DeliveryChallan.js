import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const itemSchema = new mongoose.Schema({
  id:{type:String,required:true,ref:"masteritemlist"},
  itemname:{type:String,required:true},
  itemdescription:{type:String,required:true},
  itemtype:{type:String,required:true,lowecase:true,ref:"masteritemtype"},
  itemuom:{type:String,required:true,ref:"Uom"},
  costperunit:{type:Number,default:null},
  itemdiscount:{type:Number,default:null},
  quantity:{type:Number,default:1},
  totalcost:{type:Number,default:null},
  remarks:{type:String}
});

const challaneSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  deliverychallanno:{type:String},
  toaddress:{type:String},
  site:{type:String},
  date:{type:String,lowecase:true},
  ponumber:{type:String},
  podate:{type:String,lowercase:true},
  vehiclenumber:{type:String},
  gstno:{type:String},
  otherreference:{type:String},
  mobilenumber: {type:String},
  addeditemlist: [itemSchema]
},{ timestamps:true });

challaneSchema.plugin(uniqueValidator)

export default mongoose.model('challan',challaneSchema);