import { Router } from 'express';
import { createCheckoutSession, createConnectAccountLink, createExpressDashboardLink, getConnectStatus } from '../controllers/payment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const paymentRouter=Router();
paymentRouter.route('/connect/status').get(verifyJWT,getConnectStatus);
paymentRouter.route('/connect/onboard').post(verifyJWT,createConnectAccountLink);
paymentRouter.route('/connect/dashboard').post(verifyJWT,createExpressDashboardLink);
paymentRouter.route('/checkout-session').post(verifyJWT,createCheckoutSession);

export default paymentRouter;
