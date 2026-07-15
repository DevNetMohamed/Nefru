import {apiRequest} from '../../services/api'

export const getAccount = async (accountType="tourists",page=1) =>{
    try{
        const data = await apiRequest(`/admin/accounts/${accountType}/${page}`)
        return data
    }catch(error){
        return {
            error:"error reading accounts"
        }
    }
}

export const getTrips = async (page=1) =>{
    try{
        const data = await apiRequest(`/admin/trips/${page}`)
        return data
    }catch(error){
        return {
            error:"error reading trips"
        }
    }
}