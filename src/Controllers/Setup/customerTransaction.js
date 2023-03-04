import mongoose from "mongoose";
import ParseErrors from "../../utils/ParseErrors";
import CustomerTransaction from "../../models/customertransaction";

exports.add_CustomerTransaction = (req,res)=>{
    const customerTransaction = new CustomerTransaction({
        customerid:req.body.customerid,
        quotation:req.body.quotation,
        Qno:req.body.Qno,
        po:"",
        ponum:""
    })
    customerTransaction.save().then((customervalue)=>{
        res.status(201).json({"result":"success"})
    })
    .catch((err)=>{
        res.status(400).json({errors:ParseErrors(err.errors)})
    }); 
}

exports.get_CustomerTransaction = (req,res) =>{
    // {_id: req.params.id}
    CustomerTransaction.find({'customerid' :req.params.id }).exec().then((customerdata)=>{
        const response = {
            count:customerdata.length,
            customerdata:customerdata
        }
        res.status(200).json({customerlist:response});
    }).catch((err)=>{
        res.status(400).json({error:{global:"something went wrong"}});
    })
}

exports.update_CustomerTransaction = (req,res) =>{

    // CustomerTransaction.remove( {}, function (err, result) {
    //     return res.send(result);
    // })

    CustomerTransaction.findOne({_id : req.body._id}, function (err, founddata) {
        if (err) 
            return res.status(500).send(err);
        else{
            if(!founddata)
                return res.status(404).send({ message : 'transaction not found' });
            else{
    
                if(req.body.po){
                    founddata.po = req.body.po
                    founddata.ponum = req.body.ponum
                }
                console.log(founddata)
                founddata.save(function (err,updateddata) {
                    if (err) 
                        res.status(500).send(err);
        
                    res.send({
                        status  : 200,
                        message : 'New transaction updated',
                        data : updateddata
                    })
                })
            }
        }  
    })
}