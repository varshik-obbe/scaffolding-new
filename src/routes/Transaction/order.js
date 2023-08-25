import express from 'express';
import Authentication from '../../middleware/Authentication';
import OrderController from '../../Controllers/Transaction/WorkOrder';

const router = express.Router();

router.post('/addorder', Authentication, OrderController.add_Order);

router.get('/getorderno', Authentication, OrderController.getorderno);

router.get('/getorder', Authentication, OrderController.get_Order);

router.get('/getsingleworkorder/:id', Authentication, OrderController.get_SingleWorkOrder);

router.post('/updateworkorder', Authentication, OrderController.update_Order);

export default router;
