import { Router } from 'express';
import { placeBid } from '../controllers/bid.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const bidRouter=Router();

bidRouter.route('/').post(verifyJWT,placeBid);

export default bidRouter;
