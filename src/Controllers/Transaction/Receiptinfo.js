import mongoose from "mongoose";
import async from 'async';
import ParseErrors from "../../utils/ParseErrors";
import ReceiptInfo from "../../models/generatereceieptitems";

exports.get_Receiptinfo = (req,res)=>{
    const ponumber = req.query.q;
    ReceiptInfo.
    find({"ponumber":ponumber})
    .populate('itemlist.itemid itemlist.itemlocation itemlist.itemuom','_id masteritemdescription masteritemname _id locationname uomname uomdescription')
    .exec()
    .then((receiptinfo)=>{
        const response = {
            count:receiptinfo.length,
            receiptlist:receiptinfo.map((receiptvalue)=>({
                    id:receiptvalue._id,
                    ponumber:receiptvalue.ponumber,
                    receiptnumber:receiptvalue.receiptnumber,
                    itemlist:receiptvalue.itemlist
                }))
        }
        return response;
    })
    .then((response)=>{
        res.status(200).json({receiptlist:response});
    })
    .catch((err)=>{
        res.status(500).json({error:{global:"something went wrong"}});
    })
}