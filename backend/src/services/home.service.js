import {Trip} from "../models/trip.model.js"  ;

export const getHomeData =async()=>{
    const featuredTrips = await Trip.find()
    .populate("guide" , "name")
    .limit(6)


    return{
         featuredTrips ,  
        }; 


}