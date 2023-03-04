import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const itemlistSchema = new mongoose.Schema({
    poitemid:{type:String,required:true,lowecase:true},
    itemid:{type:String,required:true,lowecase:true,ref:"masteritemlist"},
    itemuom:{type:String,required:true,lowecase:true,ref:"Uom"},
    itemquantity:{type:String,required:true,lowecase:true},
    recevingqty:{type:String,required:true,lowecase:true},
    itemlocation:{type:String,required:true,lowecase:true,ref:"Location"},
    date:{type: Date,required:true,default: Date.now}
});

const receieptlistSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    ponumber:{type:String,required:true,lowecase:true},
    poid:{type:String,required:true,lowecase:true},
    receiptnumber:{type:String,required:true,lowecase:true},
    itemlist:[itemlistSchema]
},{ timestamps:true });

receieptlistSchema.plugin(uniqueValidator)

export default mongoose.model('Receiptlist',receieptlistSchema);