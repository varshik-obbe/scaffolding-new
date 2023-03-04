import mongoose from "mongoose";
import Year from "../../models/year";


exports.add_Year = (req,res) => {
    const { data } = req.body;
    const year = new Year({
        _id:mongoose.Types.ObjectId(),
        currentyear: data.addyear
    })
    year.save().then((saveddata) => {
        res.status(200).json({success:{global:"saved data successfuly"}})
    })
    .catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}

exports.check_exists = (req,res) => {
    Year.findOne().exec().then((yeardata) => {
        console.log("yeardata fetched empty : "+yeardata)
        res.status(200).json({year:yeardata});
    })
    .catch((err) => {
        res.status(400).json({error:{global:"something went wrong"}});
    })
}

exports.update_year = (req,res) => {
    const { data } = req.body;
    const id = data.updateid;
    Year.findOneAndUpdate({_id: id}, {currentyear: data.updateyear},{new: true}).exec()
    .then((updateddata)=>{
        res.status(200).json({success:{global:"year updated successfully"}})
    })
    .catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}