import {apiRequest} from '../../services/api'


export const getDashboard = async () =>{
    try{
        const data = await apiRequest(`/admin/dashboard`)
        return data
    }catch(error){
        return {
            error:"error reading dashboard data"
        }
    }
}


export const getAccount = async (accountType="tourists",page=1) =>{
    try{
        const data = await apiRequest(`/admin/user?role=${accountType}&page=${page}`)
        return data
    }catch(error){
        return {
            error:"error reading accounts"
        }
    }
}

export const getTrips = async (page=1) =>{
    try{
        const data = await apiRequest(`/admin/tours/${page}`)
        return data
    }catch(error){
        return {
            error:"error reading trips"
        }
    }
}
