import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const customerTransactionSchema = new mongoose.Schema({
    customerid:{type:String,ref: "Customer"},
    quotation:{type:String},
    Qno:{type:String},
    po:{type:String},
    ponum:{type:String},
    invoice_link: {type:String},
    challan_link: {type:String}
},{ timestamps:true });

customerTransactionSchema.plugin(uniqueValidator)

export default mongoose.model('CustomerTransaction',customerTransactionSchema);