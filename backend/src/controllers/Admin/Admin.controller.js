import {User} from '../../models/user.model.js'
import {Trip} from '../../models/trip.model.js'

export const getAccountsAll = async (req, res) => {
  try {
    const {role,page} = req.params
    const LIMIT = 10;
    const SKIP = (page-1)*LIMIT
    const [users, total] = await Promise.all([
      User.find({role:role})
      .skip(SKIP)
      .limit(LIMIT)
      .sort({createdAt:-1}),
      User.countDocuments({role:role})
    ])
    if (users.length == 0){
      return res.status(404).json({
        "success": false,
        "message": "NotFound",
        "error": {
          "code": "NOTFOUND_ERROR",
          "details": ['no content found']
        }
      })
    }
    return res.status(200).json({
      "success": true,
      "message": "Operation completed successfully",
      "data": users,
      "meta": {
        totalRecords:total,
        totalPages:Math.ceil(total/LIMIT),
        currentPage:parseInt(page),
        headers:["NAME","EMAIL","JOINED"]
      }
    })
  } catch(error) {
    res.status(400).json({
      msg:"Failed",
      data:error})
  }
};

export const getDashboard = async (req,res)=>{
  try{
    // get users
  }catch(error){

  }
}