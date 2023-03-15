import express from 'express';
import Authentication from '../../middleware/Authentication';
import OrderController from '../../Controllers/Transaction/WorkOrder';

const router = express.Router();

router.post('/addorder', Authentication, OrderController.add_Order);

router.get('/getorder', Authentication, OrderController.get_Order);

router.post('/updateworkorder', Authentication, OrderController.update_Order);

export default router;
