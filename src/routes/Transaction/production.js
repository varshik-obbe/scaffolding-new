import express from 'express';
import Authentication from '../../middleware/Authentication';
import ProductionController from '../../Controllers/Transaction/Production';

const router = express.Router();

router.post(
  '/addproduction',
  Authentication,
  ProductionController.add_Production
);

router.get(
  '/getproduction',
  Authentication,
  ProductionController.get_Production
);

router.post(
  '/updateproductionqty',
  Authentication,
  ProductionController.update_production_qty
);


export default router;
