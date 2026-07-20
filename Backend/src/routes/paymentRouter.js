import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../controllers/payment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const paymentRouter=Router();
paymentRouter.route('/order').post(verifyJWT,createPaymentOrder);
paymentRouter.route('/verify').post(verifyJWT,verifyPayment);

export default paymentRouter;
