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
    quantity:{type:Number,default:1},
    totalcost:{type:Number,default:null}
});

const proformainvoiceSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    customerid:{type:String,required:true,lowecase:true,ref:"Customer"},
    customernumber:{type:String,lowecase:true},
    customername:{type:String,lowecase:true},
    user_email: {type:String},
    customercontactnumber:{type:String,lowecase:true},
    customergstnumber:{type:String,lowecase:true, default:null},
    invoicenumber:{type:String,lowecase:true,unique: true, default:null, required:true},
    proformainvoicenumber: {type:String,lowecase:true,unique: true, default:null, required:true},
    purchaseordernumber:{type:String,lowecase:true,unique: true, default:null},
    date:{type:String,lowecase:true},
    purchaseorderdate:{type:String,lowecase:true},
    invoicedate:{type:String,lowecase:true},
    vendorcode:{type:String,lowecase:true},
    vehiclenumber:{type:String,lowecase:true},
    hsncode:{type:String,lowecase:true},
    saccode:{type:String,lowecase:true},
    goodsDescription:{type:String},
    deliverychallannumber:{type:String,lowecase:true},
    billingaddress:{type:String},
    deliveryaddress:{type:String},
    quotationnumber:{type:String},
    quotationid: {type:String},
    remarks:{type:String},
    transportchargerequired: {type:String},
    taxableamount:{type:String,lowecase:true, default:null},
    roundoffamount:{type:String,lowecase:true, default:null},
    freightcharges:{type:String,lowecase:true, default:null},
    subtotal:{type:String,lowecase:true, default:null},
    cgst:{type:String,lowecase:true, default:null},
    sgst:{type:String,lowecase:true, default:null},
    igst:{type:String,lowecase:true, default:null},
    tcs:{type:String,lowecase:true, default:null},
    total:{type:String,lowecase:true, default:null},
    grandtotal:{type:String,lowecase:true, default:null},
    deliverychallandata: {type:String,default:null},
    workorderno: {type:String, default:null},
    workorderdate: {type:String,default:null},
    despathdate: {type:String, default:null},
    removaltime:{type:String,default:null},
    transportationcharge: {type:String,default:null},
    transportationgst: {type:String,default:null},
    advanceamountreceived:{type:String,default:null},
    addeditemlist: [itemSchema]
},{ timestamps:true });

proformainvoiceSchema.plugin(uniqueValidator)

export default mongoose.model('proformainvoice',proformainvoiceSchema);