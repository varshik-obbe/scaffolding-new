import mongoose from "mongoose";
import  uniqueValidator from "mongoose-unique-validator";

const productMaterialSchema = new mongoose.Schema({
    product_id:{type:String,required:false,lowecase:true,ref: "masteritemlist"},
    productqty:{type:String}
});

const productSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    productname:{type:String,required:true,lowecase:true},
    productMaterial:[productMaterialSchema],
    productsuom:{type:Array},
    productsqtyinmeter: {type:Array},
    productsweight: {type:Array}
},{ timestamps:true });

//productSchema.plugin(uniqueValidator)

export default mongoose.model('Product',productSchema);