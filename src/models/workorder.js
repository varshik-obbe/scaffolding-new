import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true, ref: 'masteritemlist' },
  itemname: { type: String, required: true },
  itemdescription: { type: String, required: true },
  itemtype: {
    type: String,
    required: true,
    lowecase: true,
    ref: 'masteritemtype'
  },
  itemuom: { type: String, required: true, ref: 'Uom' },
  costperunit: { type: Number, default: null },
  itemdiscount: { type: Number, default: null },
  quantity: { type: Number, default: 1 },
  totalcost: { type: Number, default: null },
  remarks: { type: String },
  totalweight: { type: String },
  readystock: { type: String },
  firstround: { type: String },
  secondround: { type: String },
  thirdround: { type: String }
});

const orderSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    workorderno: { type: String },
    companydetails: { type: String },
    contactperson: { type: String },
    date: { type: String, lowecase: true },
    officeno: { type: String },
    quotationnumber: { type: String },
    quotationid: { type: String },
    deliveryschedule: { type: String, lowercase: true },
    orderdate: { type: String },
    deliveryaddress: { type: String },
    distance: { type: String },
    sitecontactperson: { type: String },
    gstno: { type: String },
    pono: { type: String },
    completed: { type: String },
    addeditemlist: [itemSchema]
  },
  { timestamps: true }
);

orderSchema.plugin(uniqueValidator);

export default mongoose.model('order', orderSchema);
