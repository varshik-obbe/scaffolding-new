import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const customerSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    customernumber:{type:String,required:true,lowecase:true,unique: true},
    customername:{type:String,required:true,lowecase:true,default:null},
    customercontactnumber:{type:String,required:true,lowecase:true,default:null},
    customergstnumber:{type:String,lowecase:true,default:null},
    customeraddress1:{type:String,lowecase:true,default:null},
    customeraddress2:{type:String,lowecase:true,default:null},
    city:{type:String,lowecase:true,default:null},
    pincode:{type:String,lowecase:true,default:null},
    state:{type:String,lowecase:true,default:null},
    country:{type:String,lowecase:true,default:null},
    deliveryAddress:{
        address1:{type:String,lowecase:true,default:""},
        address2:{type:String,lowecase:true,default:""},
        city:{type:String,lowecase:true,default:""},
        pincode:{type:String,lowecase:true,default:""},
        state:{type:String,lowecase:true,default:""},
        country:{type:String,lowecase:true,default:""}
    },
    createdby:{type:String,lowecase:true,default:null},
    updatedby:{type:String,lowecase:true,default:null},
    codate:{type:String}
},{ timestamps:true });

customerSchema.plugin(uniqueValidator)

export default mongoose.model('Customer',customerSchema);