// import {adminSchema} from "../validation/authAdminValidation"
//require jwt
// import {jwt} from "jsonwebtoken"
// require admin model
// import {Admin} from "../../models/admin.model"
// create function
export const getAccountsAll = async (req, res) => {
  try {
    res.json({msg:"here"})
    // get data
    // check account type [guide,tourist]
    // read database and return in pagination
  } catch (error) {
    res.json({msg:"also here"})

    // res
    //   .status(500)
    //   .json({ msg: "Internal Server Error", error: error.message });
  }
};

