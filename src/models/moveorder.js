import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const itemSchema = new mongoose.Schema({
  id: { type: String, required: true, ref: 'masteritemlist' },
  itemname: { type: String, required: true },
  itemdescription: { type: String, required: true },
  itemtype: {
    type: String,
    lowecase: true,
    ref: 'masteritemtype'
  },
  itemuom: { type: String, ref: 'Uom' },
  costperunit: { type: Number, default: null },
  itemdiscount: { type: Number, default: null },
  quantity: { type: Number, default: 1 },
  totalcost: { type: Number, default: null },
  remarks: { type: String }
});

const moveOrderSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    moveorderno: { type: String },
    toaddress: { type: String, ref: 'Location' },
    fromaddress: { type: String, ref: 'Location' },
    addeditemlist: [itemSchema]
  },
  { timestamps: true }
);

moveOrderSchema.plugin(uniqueValidator);

export default mongoose.model('moveorder', moveOrderSchema);
