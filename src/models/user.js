import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  uniqueValidator from "mongoose-unique-validator";

const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String,required:true,lowercase:true},
    firstname:{type:String,required:true,lowercase:true},
    lastname:{type:String,required:true,lowercase:true},
    phone:{type:String,required:true,lowercase:true},
    startdate:{type:String,required:true,lowercase:true},
    enddate:{type:String,lowercase:true},
    username:{type:String},
    password:{type:String,required:true,lowecase:true},
    active:{type:String,required:false,lowecase:true},
    persontype:{type:String,required:true,lowecase:true},
    department:{type:String,required:true,lowecase:true},
    job:{type:String,required:true,lowecase:true},
    location:{type:String,required:true,lowecase:true},
    email:{type:String,required:true,lowecase:true,index:true,unique: true},
    createdby:{type:String,lowecase:true,default:null},
    updatedby:{type:String,lowecase:true,default:null}
},{ timestamps:true });

userSchema.methods.setPassword = function setPassword(password){
    this.password = bcrypt.hashSync(password, 10);    
}

userSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.generateJWT = function generateJWT(){
    return jwt.sign({ email: this.email, role:this.persontype }, 'SECRET');
}

userSchema.methods.toAuthJSON = function toAuthJSON(){
    return{
        email: this.email,
        token: this.generateJWT()
    }
}

userSchema.plugin(uniqueValidator)

export default mongoose.model('User',userSchema);