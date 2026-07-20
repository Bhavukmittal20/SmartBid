import { Router } from 'express';
import { getMyBidStats, placeBid } from '../controllers/bid.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const bidRouter=Router();

bidRouter.route('/stats').get(verifyJWT,getMyBidStats);
bidRouter.route('/').post(verifyJWT,placeBid);

export default bidRouter;
