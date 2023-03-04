import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";


const yearSchema = new mongoose.Schema({ 
    _id:mongoose.Schema.Types.ObjectId,
    currentyear: {type: String,required: true,lowercase: true,unique: true},
},{timestamps: true});


yearSchema.plugin(uniqueValidator)

export default mongoose.model('Year',yearSchema);