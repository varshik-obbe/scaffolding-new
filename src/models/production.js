import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const subAssemblySchema = new mongoose.Schema({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  thickness: { type: String, required: true, default: 0 },
  quantity: { type: String, required: true, default: 0 },
  quantityPerMeter: { type: String, required: true, default: 0 },
  quantityPerKg: { type: String, required: true, default: 0 },
  total: { type: String, required: true, default: 0 }
});
const product = new mongoose.Schema({
  item: { type: String, lowercase: true },
  quantity: { type: String, lowecase: true, default: null },
  subAssembly: [subAssemblySchema]
});
const productionSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    productionorderno: { type: Number, lowecase: true },
    customerid: {
      type: String,
      required: true,
      lowecase: true,
      ref: 'Customer'
    },
    date: { type: String, lowecase: true },
    products: [product],
    transactionHistrory : {type : Array}
  },
  { timestamps: true }
);

productionSchema.plugin(uniqueValidator);

export default mongoose.model('production', productionSchema);
