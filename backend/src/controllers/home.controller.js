import { asyncHandler } from "../utils/asyncHandler.js";
import {getHomeData} from "../services/home.service.js"


export const getHome = asyncHandler(async (req, res) => {
    const data = await getHomeData();
    res.status(200).json({success:true ,
        data:data , message:"Home data fetched successfully"  });      
    });


