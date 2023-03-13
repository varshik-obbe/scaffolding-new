import mongoose from 'mongoose';
import async from 'async';
import ParseErrors from '../../utils/ParseErrors';
import MoveOrder from '../../models/moveorder';
import TotalItemListAvaliable from '../../models/totalitemlistavaliable';

exports.add_MoverOrder = (req, res) => {
  const { data } = req.body;
  const challan = new MoveOrder({
    _id: mongoose.Types.ObjectId(),
    addeditemlist: data.AddedIteminfo,
    moveorderno: data.moveorderno,
    toaddress: data.toaddress,
    fromaddress: data.fromaddress
  });
  challan
    .save()
    .then(async quotationvalue => {
      const moveorderdata = await quotationvalue
        .populate(
          'customerid addeditemlist.itemuom addeditemlist.itemtype',
          '_id masteritemtypename uomname'
        )
        .execPopulate();
      // data.AddedIteminfo.map(item => {
      //   console.log(item);
      //   TotalItemListAvaliable.findOneAndUpdate(
      //     { $and: [{ locationid: data.fromaddress, itemid: item.id }] },
      //     { $inc: { itemquantity: -1 } },
      //     { new: true },
      //     function(err, response) {}
      //   );
      // });
      const itemlistvalue =  await dbAddorUpdateItemsQuery();
      const decValue = await decreaseItemsQuery();
      res.status(201).json({ moveorderdata });
    })
    .catch(err => res.status(400).json({ errors: ParseErrors(err.errors) }));

    const dbAddorUpdateItemsQuery = async() =>{
      if(data.AddedIteminfo.length > 0){
          const itemdata = await Promise.all( data.AddedIteminfo.map(async(item)=>{
              const list = await TotalItemListAvaliable.find({"$and" : [ { locationid:data.toaddress } , { itemid:item.id } ] }).lean().exec()
              console.log("-----------------LIST-----------------------------")
                  console.log(list)
                  if(Array.isArray(list) && list.length){
                    console.log(item.id)
                      const updateitem={
                          itemquantity:list[0].itemquantity ? (parseFloat(item.quantity) + list[0].itemquantity) : list[0].itemquantity
                      };
                      const updateditem = await TotalItemListAvaliable.findOneAndUpdate({"$and" : [ { locationid:data.toaddress } , { itemid:item.id }]}, {$set: updateitem}).lean().exec()
                      return  updateditem;
                  }
                  console.log("------------------Item before adding----------------------");
                  console.log(item.id)
                      const itemAdded = new TotalItemListAvaliable({
                          _id:mongoose.Types.ObjectId(),
                          locationid:data.toaddress,
                          itemid:item.id,
                          itemquantity:item.quantity
                      });
                      const itemadded = await itemAdded.save();
                      return itemadded;
              
          }));
          return itemdata;
          }
          // eslint-disable-next-line no-throw-literal
          throw "itemlist is not an array";    
    } 
    
    const decreaseItemsQuery = async() =>{
      if(data.AddedIteminfo.length > 0){
          const itemdata = await Promise.all( data.AddedIteminfo.map(async(item)=>{
              const list = await TotalItemListAvaliable.find({"$and" : [ { locationid:data.fromaddress } , { itemid:item.id } ] }).lean().exec()
              console.log("------- Decrease---------");
              console.log(list);
                  if(Array.isArray(list) && list.length){
                      const updateitem={
                          itemquantity:list[0].itemquantity - Number(item.quantity)
                      };
                      const updateditem = await TotalItemListAvaliable.updateOne({"$and" : [ { locationid:data.fromaddress } , { itemid:item.id }]}, {$set: updateitem}).lean().exec()
                      
                      return  updateditem;
                  }
                      // const itemAdded = new TotalItemListAvaliable({
                      //     _id:mongoose.Types.ObjectId(),
                      //     locationid:data.fromaddress,
                      //     itemid:item.id,
                      //     itemquantity:item.quantity
                      // });
                      // const itemadded = await itemAdded.save();
                      // return itemadded;
              
          }));
          return itemdata;
          }
          // eslint-disable-next-line no-throw-literal
          throw "itemlist is not an array";    
    }   



};
exports.get_MoverOrder = (req, res) => {
  // MoveOrder.remove({},function(err,data){
  //   return res.send(200)
  // })
  MoveOrder.find()
    .populate('fromaddress toaddress')
    .exec()
    .then(invoicedata => {
      console.log(JSON.stringify(invoicedata));
      const response = {
        count: invoicedata.length,
        moveorderdata: invoicedata.map(data => ({
          _id: data.id,
          moveorderno: data.moveorderno,
          toaddress: data.toaddress.locationname ? data.toaddress.locationname : '',
          fromaddress: data.fromaddress.locationname
        }))
      };
      console.log(response);
      res.status(200).json({ moveorderlist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong' } });
    });
};

exports.get_ItemsForMoveOrder = (req,res) => {
  console.log("move order id is", req.params.id);
  MoveOrder.findOne({ _id: req.params.id })
  .exec()
  .then(invoicedata => {
    console.log(JSON.stringify(invoicedata));
    const response = {
      count: invoicedata.addeditemlist.length,
      itemdata: invoicedata.addeditemlist.map(data => ({
        id: data.id,
        itemname: data.itemname,
        itemdescription: data.itemdescription,
        itemtype: data.itemtype,
        itemuom: data.itemuom,
        costperunit: data.costperunit,
        itemdiscount: data.itemdiscount,
        quantity: data.quantity,
        totalcost: data.totalcost,
        remarks: data.remarks
      }))
    };
    console.log(response);
    res.status(200).json({ itemlist: response });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: { global: 'something went wrong' } });
  });
};
