import mongoose from "mongoose";

import {User} from '../../models/user.model.js'
import {Trip} from '../../models/trip.model.js'

import {getDashboardData} from './services.js'

export const getUserById = async(req,res) =>{
  try{
    const userId = req.params.id;
    if(!userId) return res.status(400).json({
        success: false,
        message: "Invalid request",
        error: { code: "INVALID_REQUEST", details: ["Request is invalid"] }
      });
    const user = await User.findById(userId)
    if(!user) return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] }
      });
    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: user,
    })
  }catch(error){
    console.error("Error fetching accounts:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching account",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: []
      }
    });
  }
}

export const getAllUsers = async (req, res) => {
  try {
    let { role , page } = req.query; 

    if(!role || ! page) return res.status(400).json({
        success: false,
        message: "Invalid request",
        error: { code: "INVALID_REQUEST", details: ["Request is invalid"] }
      });

    const currentPage = parseInt(page, 10);
    if (isNaN(currentPage) || currentPage < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page parameter",
        error: { code: "VALIDATION_ERROR", details: ["Page must be a positive integer"] }
      });
    }

    const LIMIT = 10;
    const SKIP = (currentPage - 1) * LIMIT;

    const [users, total] = await Promise.all([
      User.find({ role })
      .sort({ createdAt: -1 })
      .skip(SKIP)
      .limit(LIMIT),
      User.countDocuments({ role })
    ]);

    const totalPages = Math.max(1, Math.ceil(total / LIMIT));

    let pagingView = [];
    if (totalPages <= 3) {
      pagingView = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages, currentPage + 1);
      pagingView = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      if (!pagingView.includes(1)) pagingView.unshift(1);
      if (!pagingView.includes(totalPages)) pagingView.push(totalPages);
    }
    
    if(users.length==0) return res.status(404).json({
        success: false,
        message: "No more records",
        data:[],
        "meta": {
          totalRecords:total,
          totalPages:totalPages,
          currentPage:totalPages,
          headers:["USER","EMAIL","JOINED"],
          types:["tourist","guide","admin"]
        },
        error: { code: "NOT_FOUND", details: ["No more records found"] }
      });

    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: users,
      meta: {
        totalRecords: total,
        totalPages,
        recordsCount:users.length,
        currentPage,
        pagingView,
        headers:["USER","EMAIL","JOINED"],
        types:["tourist","guide","admin"]
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching accounts",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: []
      }
    });
  }
};

export const updateUserById = async(req,res)=>{
  try{
    //update user data
    const data = req.body
    const userId =req.params.id
    const isUser = await User.findById(userId)
    if(!isUser) return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] }
      });
    const user = await User.findByIdAndUpdate(userId,data,{returnDocument: 'after'})
    return res.status(200).json({
      "success": true,
      "message": "Operation completed successfully",
      "data": user
    })
  }catch(error){
     // Duplicate key — e.g. email already belongs to another user
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      return res.status(409).json({
        success: false,
        message: "Conflict: a user with this email already exists",
        error: { code: "DUPLICATE_ERROR", details: [`${field} must be unique`] }
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] }
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] }
    });
  }
}

export const getDashboard = async (req,res)=>{
  try{
    // in selected duration
    // get total users, total tours, total book, revenue
    // bookings through the month

    // get all tours by status
    
    // {
    //   totalUser:"",
    //   totalTours:"",
    //   totalBookings:"",
    //   revenue:"",
    //   bookingsChart:[1,2,2,23,12],
    //   toursStatus:{
    //     approved:12,
    //     rejected:2,
    //     pending:5
    //   },
    //   topTours:[{...}]
    // }
    const data = await getDashboardData()
    res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retreiving dashboard data",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] }
    });
  }
}

export const banUserById = async(req,res)=>{
  try{
    //update user data
    const data = req.body
    const userId =req.params.id
    const isUser = await User.findById(userId)
    if(!isUser) return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] }
      });
    const user = await User.findByIdAndUpdate(userId,{isActive:false},{returnDocument: 'after'})
    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data:user
    })
  }catch(error){
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        data:error,
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] }
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] }
    });
  }
}

export const unbanUserById = async(req,res)=>{
  try{
    //update user data
    const data = req.body
    const userId =req.params.id
    const isUser = await User.findById(userId)
    if(!isUser) return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] }
      });
    const user = await User.findByIdAndUpdate(userId,{isActive:true},{returnDocument: 'after'})
    return res.status(200).json({
      "success": true,
      "message": "Operation completed successfully",
      "data":user
    })
  }catch(error){
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        data:error,
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] }
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] }
    });
  }
}

export const deleteUserById = async(req,res)=>{
  try{
    const data = req.body
    const userId =req.params.id
    const isUser = await User.findById(userId)
    if(!isUser) return res.status(404).json({
      success: false,
      message: "User not found",
      error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] }
    });
    const user = await User.findByIdAndDelete(userId)
    console.log(user)
    return res.status(200).json({
      "success": true,
      "message": "Operation completed successfully",
      "data":user
    })
  }catch(error){
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        data:error,
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] }
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] }
    });
  }
}

export const guideActivation = async(req,res)=>{
  try{
    const action = req.route.path.split("/").at(-1)
    const userId = req.params.id
    const allowed = {
      approve:"approved",
      reject:"rejected",
      suspend:"suspended"
    }
    if(!action in allowed) return res.status(404).json({
      success: false,
      message: "Action is invalid",
      error: { code: "VLIDATION_ERROR", details: ["Action is not a valid option"] }
    });

    const isUser = await User.findById(userId)
    if(!isUser) return res.status(404).json({
      success: false,
      message: "User not found",
      error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] }
    });

    if(isUser.verificationStatus == allowed[action])return res.status(200).json({
      success: false,
      message: `GuideProfile already ${allowed[action]}`,
      error: { code: "NO_ACTION", details: [`GuideProfile already ${allowed[action]}`] }
    });

    const user = await User.findByIdAndUpdate(userId,{verificationStatus:allowed[action]},{new:true})
    return res.status(200).json({
      "success": true,
      "message": "Operation completed successfully",
      "data":user
    })
  }catch(error){
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        data:error,
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] }
      });
    }
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [error] }
    });
  }
}

export const getAllTours = async(req,res)=>{
  try{
    //get all trips
    const {role,page} = req.params
    const currentPage = parseInt(page)

    const LIMIT = 10;
    const SKIP = (currentPage-1)*LIMIT

    const [trips, total] = await Promise.all([
      Trip.find()
      .skip(SKIP)
      .limit(LIMIT)
      .sort({createdAt:-1}),
      Trip.countDocuments()
    ])
    
    const totalPages = Math.ceil(total/LIMIT)
    // claculate pagination view
    let pagingView = []
    if(currentPage == totalPages){
      pagingView = [currentPage-1,currentPage]
    }else{
      pagingView = [currentPage,currentPage+1]
    }
    
    if(trips.length==0) return res.status(404).json({
        success: false,
        message: "No more records",
        data:[],
        "meta": {
          totalRecords:total,
          totalPages:totalPages,
          currentPage:totalPages,
          headers:["TITLE","LOCATION","STATUS","RATE"]
        },
        error: { code: "NOT_FOUND", details: ["No more records found"] }
      });

    return res.status(200).json({
      "success": true,
      "message": "Operation completed successfully",
      "data": trips,
      "meta": {
        totalRecords:total,
        totalPages:totalPages,
        currentPage:parseInt(currentPage),
        headers:["TITLE","LOCATION","STATUS","RATE"]
      }
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [error] }
    });
  }
}

export const getTourById = async(req,res)=>{
  try{
    const tripId =req.params.id
    const isTrip = await Trip.findById(tripId)
    if(!isTrip) return res.status(404).json({
        success: false,
        message: "Trip not found",
        error: { code: "NO_CONTENT_ERROR", details: ["Trip not registered"] }
      });

    const trip = isTrip
    return res.status(200).json({
      "success": true,
      "message": "Operation completed successfully",
      "data": trip,
    })
  }catch(error){
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] }
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] }
    });
  }
}

export const tourAction = async(req,res)=>{
  try{
    const action = req.route.path.split("/").at(-1)
    const userId = req.params.id
    const allowed = {
      approve:"approved",
      reject:"rejected",
      draft:"drafted"
    }
    if(!action in allowed) return res.status(404).json({
      success: false,
      message: "Action is invalid",
      error: { code: "VLIDATION_ERROR", details: ["Action is not a valid option"] }
    });

    const isUser = await Trip.findById(userId)
    if(!isUser) return res.status(404).json({
      success: false,
      message: "Trip not found",
      error: { code: "NO_CONTENT_ERROR", details: ["Trip not registered"] }
    });

    if(isUser.verificationStatus == allowed[action])return res.status(200).json({
      success: false,
      message: `GuideProfile already ${allowed[action]}`,
      error: { code: "NO_ACTION", details: [`GuideProfile already ${allowed[action]}`] }
    });

    const user = await Trip.findByIdAndUpdate(userId,{status:allowed[action]},{new:true})
    return res.status(200).json({
      "success": true,
      "message": "Operation completed successfully",
      "data":user
    })
  }catch(error){
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        data:error,
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] }
      });
    }
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [error] }
    });
  }
}
// export const getBooking = async(req,res)=>{
//   try{
//     //get all trips
//     const {role,page} = req.params
//     return res.status(200).json({
//       "success": true,
//       "message": "Operation completed successfully",
//       "data": trips,
//       "meta": {
//         totalRecords:total,
//         totalPages:totalPages,
//         currentPage:parseInt(currentPage),
//         headers:["TITLE","LOCATION","STATUS","RATE"]
//       }
//     })
//   }catch(error){
//     res.status(400).json({
//       msg:"Failed",
//       data:error})
//   }
// }