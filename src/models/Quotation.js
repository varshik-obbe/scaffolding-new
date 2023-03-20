import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const itemSchema = new mongoose.Schema({
    id:{type:String,required:true,ref:"masteritemlist"},
    itemname:{type:String,required:true},
    itemdescription:{type:String,required:true},
    itemshortdescription:{type:String},
    itemtype:{type:String,required:true,lowecase:true,ref:"masteritemtype"},
    itemuom:{type:String,required:true,ref:"Uom"},
    costperunit:{type:Number,default:null},
    itemdiscount:{type:Number,default:null},
    itemdiscountamount:{type:Number,default:null},
    quantity:{type:Number,default:1},
    totalcost:{type:Number,default:null}
});

const quotationSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    customerid:{type:String,required:true,lowecase:true,ref:"Customer"},
    customernumber:{type:String,required:true,lowecase:true},
    customername:{type:String,required:true,lowecase:true},
    customercontactnumber:{type:String,required:true,lowecase:true},
    customergstnumber:{type:String,lowecase:true, default:null},
    quotationnumber:{type:String,lowecase:true,unique: true, default:null},
    date:{type:String,required:true,lowecase:true},
    subject:{type:String,required:false,lowecase:true},
    tax:{type:String,lowecase:true, required:true, default:null},
    totalvalue:{type:String,lowecase:true, required:true, default:null},
    customeraddress:{type:String,default:null},
    
    tcharge:{type:String,default:null},
    ws:{type:String,default:null},
    loadingcharge:{type:String,default:null},
    addeditemlist: [itemSchema]
},{ timestamps:true });

quotationSchema.plugin(uniqueValidator)

export default mongoose.model('Quotation',quotationSchema);