import {User} from '../../models/user.model.js'
import {Trip} from '../../models/trip.model.js'

export const getAllUsers = async(req,res) =>{
  try{
    
  }catch(error){}
}

export const getAccountsAll = async (req, res) => {
  try {
    // 1. Use query parameters instead of route params (Recommended)
    // e.g., /api/accounts?role=admin&page=2
    let { role , page = 1 } = req.query; 

    // 2. Validate and parse page
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
    // 7. Secure Error Handling
    console.error("Error fetching accounts:", error); // Log real error for devs
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching accounts",
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: [] // Don't send 'error' to the client!
      }
    });
  }
};

export const getDashboard = async (req,res)=>{
  try{
    // get users
  }catch(error){

  }
}

export const getTrips = async(req,res)=>{
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
    res.status(400).json({
      msg:"Failed",
      data:error})
  }
}

export const getBooking = async(req,res)=>{
  try{
    //get all trips
    const {role,page} = req.params
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
    res.status(400).json({
      msg:"Failed",
      data:error})
  }
}