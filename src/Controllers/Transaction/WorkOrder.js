import mongoose from 'mongoose';
import async from 'async';
import ParseErrors from '../../utils/ParseErrors';
import WorkOrder from '../../models/workorder';

exports.add_Order = (req, res) => {
  const { data } = req.body;
  const challan = new WorkOrder({
    _id: mongoose.Types.ObjectId(),
    addeditemlist: data.AddedIteminfo,
    workorderno: data.workorderno,
    companydetails: data.companydetails,
    contactperson: data.contactperson,
    date: data.date,
    officeno: data.officeno,
    deliveryschedule: data.deliveryschedule,
    orderdate: data.orderdate,
    deliveryaddress: data.deliveryaddress,
    distance: data.distance,
    sitecontactperson: data.sitecontactperson,
    gstno: data.gstno,
    pono: data.pono
  });
  challan
    .save()
    .then(async quotationvalue => {
      const orderdata = await quotationvalue
        .populate(
          'customerid addeditemlist.itemuom addeditemlist.itemtype',
          '_id masteritemtypename uomname'
        )
        .execPopulate();
      res.status(201).json({ orderdata });
    })
    .catch(err => res.status(400).json({ errors: ParseErrors(err.errors) }));
};
exports.get_Order = (req, res) => {
  WorkOrder.find()
    .populate(
      'customerid addeditemlist.id addeditemlist.itemuom addeditemlist.itemtype addeditemlist.itemuom',
      '_id masteritemtypename uomname masteritemname masteritemimage masteritemunitwt'
    )
    .exec()
    .then(invoicedata => {
      const response = {
        count: invoicedata.length,
        orderdata: invoicedata.map(data => ({
          _id: data.id,
          addeditemlist: data.addeditemlist,
          workorderno: data.workorderno,
          companydetails: data.companydetails,
          contactperson: data.contactperson,
          date: data.date,
          officeno: data.officeno,
          deliveryschedule: data.deliveryschedule,
          orderdate: data.orderdate,
          deliveryaddress: data.deliveryaddress,
          distance: data.distance,
          sitecontactperson: data.sitecontactperson,
          gstno: data.gstno,
          pono: data.pono
        }))
      };
      console.log(response);
      res.status(200).json({ orderlist: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: { global: 'something went wrong' } });
    });
};
