import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {getAuctionDetails, getAuctions, registerAuction} from '../controllers/auction.controller.js'
import {upload} from '../middlewares/multer.middleware.js'
const auctionRouter=Router()
auctionRouter.route('/create-auction').post(verifyJWT,upload.array('auctionPhotos',5),registerAuction)
auctionRouter.route('/').get(getAuctions)
auctionRouter.route('/:auctionId').get(getAuctionDetails)
export default auctionRouter
