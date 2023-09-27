import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;


const itemSchema = new mongoose.Schema({
    id:{type:String,required:true},
    itemname:{type:String,required:true},
    itemdescription:{type:String,required:true},
    itemtype:{type:String,required:true,lowecase:true},
    itemuom:{type:String,required:true},
    itemlocation:{type:String,required:true,lowecase:true},
    costperunit:{type:Number,default:null},
    quantity:{type:Number,default:1},
    receivedqty:{type:Number,default:0},
    totalcost:{type:Number,default:null}
});

const purchaseOrderSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    supplierid:{type:String,required:true,lowecase:true},
    suppliername:{type:String,required:true,lowecase:true},
    suppliernumber:{type:String,required:true,lowecase:true},
    suppliergstnumber:{type:String,required:true,lowecase:true},
    supplieraddress1:{type:String,required:true,lowecase:true},
    supplieraddress2:{type:String,required:true,lowecase:true},
    suppliercity:{type:String,required:true,lowecase:true},
    supplierpincode:{type:String,required:true,lowecase:true},
    supplierstate:{type:String,required:true,lowecase:true},
    suppliercountry:{type:String,required:true,lowecase:true},
    suppliercontactid: { type: String, ref: 'Supplierlist' },
    currencyid:{type:String,lowecase:true,lowercase:true},
    referenceno:{type:String,required:false,lowecase:true},
    quotationno:{type:String,lowecase:true, default:null},
    ponumber:{type:Number,lowecase:true, required:true, default:null},
    requestdeliverydate:{type:String,required:true,lowecase:true},
    subject:{type:String,required:false,lowecase:true},
    totalvalue:{type:String,lowecase:true, required:true, default:null},
    loadingcharge:{type:String,default:null},
    weighttons:{type:String,default:null},
    transportationcharge:{type:String,default:null},
    tax:{type:String,lowecase:true, default:null},
    cgst:{type:String,lowecase:true, default:null},
    sgst:{type:String,lowecase:true, default:null},
    igst:{type:String,lowecase:true,  default:null},
    addeditemlist: [itemSchema]
},{ timestamps:true });

// purchaseOrderSchema.virtual('suppliercontactname', {
//     ref:"Supplierlist",
//     localField: 'suppliercontactid',
//     foreignField: 'supplierContactList.$._id'
// });

// purchaseOrderSchema.set('toObject', { virtuals: true });
// purchaseOrderSchema.set('toJSON', { virtuals: true });

purchaseOrderSchema.plugin(uniqueValidator)

export default mongoose.model('Purchaseorder',purchaseOrderSchema);