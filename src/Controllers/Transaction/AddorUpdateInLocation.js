/* eslint-disable radix */
import mongoose from "mongoose";
import async from "async";
import ParseErrors from "../../utils/ParseErrors";
import GenerateReceieptItems from "../../models/generatereceieptitems";
import TotalItemListAvaliable from "../../models/totalitemlistavaliable";
import PurchaseOrder from "../../models/purchaseorder";

const forEach = require('async-foreach').forEach;

// exports.addorupdate_Items = (req,res)=>{
//     const { data } = req.body;
//     console.log("__COMING_TO_ADDORUPDATELOCATION_");
//     console.log(data.iteminfo);
//     const itemlist = data.iteminfo;
//     if(itemlist.length > 0){
//         itemlist.forEach((item,i)=>{
//             console.log("_FOREACH_LOOP_");
//             console.log(item);
//             TotalItemListAvaliable.find({$and : [ { locationid:"5d3460e21c9d44000062d312" } , { itemid:"5d4ab4555afbc51b9054e08a" } ] }).exec().then((itemvalue)=>{
//                 console.log("itemvalue found");
//                 console.log(itemvalue);
//                 if(itemvalue.id){
//                     console.log("__IF_CONDITION___");
//                     console.log(itemvalue);
//                 }else{
//                     console.log("__IF_ELSE_CONDITION___");
//                     const itemAdded = new TotalItemListAvaliable({
//                         _id:mongoose.Types.ObjectId(),
//                         locationid:item.itemlocation,
//                         Itemid:item.itemid,
//                         itemquantity:item.recevingqty
//                     });
//                     itemAdded.save();
//                 }
//             }).catch((err)=>{
//                 console.log(err);
//             })
//         })
//     }
// }

exports.addorupdate_Items = async (req, res) => {
    const { data } = req.body;
    const itemlist = data.iteminfo;


    const generateReceieptItems = async () => {

        const receieptItems = await GenerateReceieptItems.find().lean().exec();
        let receiptno = 1001;
        // eslint-disable-next-line no-self-assign
        if (receieptItems.length) { receiptno += receieptItems.length };

        const receieptItem = new GenerateReceieptItems({
            _id: mongoose.Types.ObjectId(),
            ponumber: data.ponumber,
            poid: data.poid,
            receiptnumber: receiptno,
            itemlist: data.iteminfo
        })
        const receieptitem = await receieptItem.save();
        if (receieptitem) {
            return receieptitem;
        }
        // eslint-disable-next-line no-throw-literal
        throw "something went wrong";

    }

    const updatePurchaseOrder = async () => {
        const purchaseorderlist = await PurchaseOrder.find({ "$and": [{ _id: data.poid }, { ponumber: data.ponumber }] }).lean().exec();
        if (Array.isArray(purchaseorderlist) && purchaseorderlist.length) {
            const updateditem = await Promise.all(data.iteminfo.map(async (item) => {
                const updatelist = PurchaseOrder.updateOne(
                    { "$and": [{ _id: data.poid }, { "addeditemlist._id": item.poitemid }] },
                    {
                        $set: {
                            "addeditemlist.$.receivedqty": item.totalqty
                        }
                    }
                ).lean().exec()
                return updatelist;
            }))
            return updateditem;

        }
        // eslint-disable-next-line no-throw-literal
        throw "itemlist is not an array";

    }
    const dbAddorUpdateItemsQuery = async () => {
        if (itemlist.length > 0) {
            const itemdata = await Promise.all(itemlist.map(async (item) => {
                const list = await TotalItemListAvaliable.find({ "$and": [{ locationid: item.itemlocation }, { itemid: item.itemid }] }).lean().exec()

                if (Array.isArray(list) && list.length) {
                    const updateitem = {
                        locationid: item.itemlocation,
                        poitemid: item.poitemid,
                        itemquantity: list[0].itemquantity ? (parseFloat(item.recevingqty) + list[0].itemquantity) : item.recevingqty
                    };
                    const updateditem = await TotalItemListAvaliable.updateOne({ "$and": [{ locationid: item.itemlocation }, { itemid: item.itemid }] }, { $set: updateitem }).lean().exec()
                    return updateditem;
                }
                const itemAdded = new TotalItemListAvaliable({
                    _id: mongoose.Types.ObjectId(),
                    locationid: item.itemlocation,
                    itemid: item.itemid,
                    itemquantity: item.recevingqty
                });
                const itemadded = await itemAdded.save();
                return itemadded;

            }));
            return itemdata;
        }
        // eslint-disable-next-line no-throw-literal
        throw "itemlist is not an array";
    }

    try {
        const receieptitem = await generateReceieptItems();
        if (receieptitem) {
            const receipt = await updatePurchaseOrder();
            const itemlistvalue = await dbAddorUpdateItemsQuery();
            res.status(200).json({ success: { receiptnumber: receieptitem.receiptnumber } });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: { global: "something went wrong" } });
    }
}

exports.add_Items = async (req, res) => {
    const { data } = req.body;
    const itemlist = data.iteminfo;

    const dbAddorUpdateItemsQuery = async () => {
        if (itemlist.length > 0) {
            const itemdata = await Promise.all(itemlist.map(async (item) => {
                const list = await TotalItemListAvaliable.find({ "$and": [{ locationid: item.itemlocation }, { itemid: item.itemid }] }).lean().exec()

                if (Array.isArray(list) && list.length) {
                    const updateitem = {
                        locationid: item.itemlocation,
                        poitemid: item.itemid,
                        itemquantity: item.recevingqty
                    };
                    const updateditem = await TotalItemListAvaliable.updateOne({ "$and": [{ locationid: item.itemlocation }, { itemid: item.itemid }] }, { $set: updateitem }).lean().exec()
                    return updateditem;
                }
                const itemAdded = new TotalItemListAvaliable({
                    _id: mongoose.Types.ObjectId(),
                    locationid: item.itemlocation,
                    itemid: item.itemid,
                    itemquantity: item.recevingqty
                });
                const itemadded = await itemAdded.save();
                return itemadded;

            }));
            return itemdata;
        }
        // eslint-disable-next-line no-throw-literal
        throw "itemlist is not an array";
    }

    try {
        const itemlistvalue = await dbAddorUpdateItemsQuery();
        res.status(200).json({ success: { ...itemlistvalue } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: { global: "something went wrong" } });
    }
}

exports.delete_Items = async (req, res) => {
    const { data } = req.body;
    const itemlist = data.iteminfo;

    const dbAddorUpdateItemsQuery = async () => {
        if (itemlist.length > 0) {
            const itemdata = await Promise.all(itemlist.map(async (item) => {
                const list = await TotalItemListAvaliable.find({ locationid: item.itemlocation }).lean().exec()

                // if (Array.isArray(list) && list.length) {
                //     const updateditem = await TotalItemListAvaliable.deleteOne({ "$and": [{ locationid: item.itemlocation }, { itemid: null }] }).lean().exec()
                //     return updateditem;
                // }
                return list;
            }
            ));
            return itemdata;
        }
        // eslint-disable-next-line no-throw-literal
        throw "itemlist is not an array";
    }

    try {
        const itemlistvalue = await dbAddorUpdateItemsQuery();
        res.status(200).json({ success: { ...itemlistvalue } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: { global: "something went wrong" } });
    }
}


exports.get_ItemsList = (req, res) => {
    const locationid = req.query.locationid;
    const itemid = req.query.itemid;
    if (locationid && itemid) {
        TotalItemListAvaliable
            .find({ "$and": [{ locationid }, { itemid }] })
            .populate('locationid itemid')
            .exec()
            .then((itemlist) => {
                const response = {
                    count: itemlist.length,
                    itemlist: itemlist.map((itemvalue) => ({
                        id: itemvalue._id,
                        locationname: itemvalue.locationid.locationname,
                        itemname: itemvalue.itemid.masteritemname,
                        itemdescription: itemvalue.itemid.masteritemdescription,
                        itemquantity: itemvalue.itemquantity
                    }))
                };
                return response;
            }).then((response) => {
                console.log(response);
                res.status(200).json({ totalitemlistvalues: response })
            }).catch((err) => {
                res.status(500).json({ error: { global: err } });
            })
    } else if (locationid) {
        // TotalItemListAvaliable.deleteMany({_id:['5dc275741411eb611c150d04']},function(e,s) {

        // })
        TotalItemListAvaliable
            .find({ locationid })
            .populate('locationid itemid')
            .exec()
            .then((itemlist) => {
                console.log("-----ITem list-------")
                console.log(JSON.stringify(itemlist))
                const response = {
                    count: itemlist.length,
                    itemlist: itemlist.map((itemvalue) => ({
                        id: itemvalue._id,
                        locationname: itemvalue.locationid.locationname,
                        itemid: itemvalue.itemid ? itemvalue.itemid._id : null,
                        itemname: itemvalue.itemid ? itemvalue.itemid.masteritemname : null,
                        itemdescription: itemvalue.itemid ? itemvalue.itemid.masteritemdescription : null,
                        itemquantity: itemvalue.itemquantity
                    }))
                };
                return response;
            }).then((response) => {
                console.log(response);
                res.status(200).json({ totalitemlistvalues: response })
            }).catch((err) => {
                res.status(500).json({ error: { global: err } });
            })
    } else {
        TotalItemListAvaliable.find({ itemid })
            .populate('locationid itemid')
            .exec()
            .then((itemlist) => {
                const response = {
                    count: itemlist.length,
                    itemlist: itemlist.map((itemvalue) => ({
                        id: itemvalue._id,
                        locationname: itemvalue.locationid.locationname,
                        itemname: itemvalue.itemid.masteritemname,
                        itemdescription: itemvalue.itemid.masteritemdescription,
                        itemquantity: itemvalue.itemquantity
                    }))
                };
                return response;
            }).then((response) => {
                console.log(response);
                res.status(200).json({ totalitemlistvalues: response })
            }).catch((err) => {
                res.status(500).json({ error: { global: err } });
            })
    }

}