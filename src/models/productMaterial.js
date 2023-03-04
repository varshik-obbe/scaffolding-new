// import mongoose from "mongoose";
// import  uniqueValidator from "mongoose-unique-validator";

// const productMaterialSchema = new mongoose.Schema({
//     _id:mongoose.Schema.Types.ObjectId,
//     product_id:{type:String,required:true,lowecase:true,index:true},
//     material_id:{type:String,required:true,lowecase:true,index:true},
//     qty:{type:String,required:true,lowecase:true,index:true}
// },{ timestamps:true });

// productMaterialSchema.plugin(uniqueValidator)

// export default mongoose.model('Product',productMaterialSchema);