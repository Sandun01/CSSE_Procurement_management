import axios from 'axios'

import {
    Backend_API_URL,
    Get_All_Users,
    Delete_User,
    User_Registration,
    User_Token_Auth,
    Get_All_SITE_MANAGERS,
    Get_All_SUPPLIERS,
} from '../../AppConst'

class UserServices {
    //register user
    async registerNewUser(user) {
        var return_value = null
        
        const accessToken = window.localStorage.getItem('accessToken');

        var config = {
            headers : {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        await axios
            .post(Backend_API_URL + User_Registration, user, config)
            .then((res) => {
                if (res.data) {
                    return_value = res
                }
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }

    //get all users
    async getAllUsers() {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken');

        var config = {
            headers : {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        await axios
            .get(Backend_API_URL + Get_All_Users, config)
            .then((res) => {
                if (res.data) {
                    return_value = res.data
                }
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }

    //get user from token
    loggedInUserData = async () => {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken');
        await axios
            .post(Backend_API_URL + User_Token_Auth, {
                accessToken: accessToken,
            })
            .then((res) => {
                return_value = res.data.user
                // console.log(user);
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value;
    }

    //delete user
    async deletesSerByID(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken');

        var config = {
            headers : {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        await axios
            .delete(Backend_API_URL + Delete_User + id, config)
            .then((res) => {
                if (res.data) {
                    return_value = res.data
                }
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }

    //get all Site managers
    async getAllSiteManagers() {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken');

        var config = {
            headers : {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        await axios
            .get(Backend_API_URL + Get_All_SITE_MANAGERS, config)
            .then((res) => {
                if (res.data) {
                    return_value = res.data
                }
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }

    //get all suppliers
    async getAllSuppliers() {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken');

        var config = {
            headers : {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        await axios
            .get(Backend_API_URL + Get_All_SUPPLIERS, config)
            .then((res) => {
                if (res.data) {
                    return_value = res.data
                }
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }

    //get user by Id
    getUserByID = async (id) => {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken');

        var config = {
            headers : {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        await axios
            .get(Backend_API_URL + Get_All_Users + `view/${id}`, config)
            .then((res) => {
                return_value = res
            })
            .catch((error) => {
                console.log(error)
            })

        return return_value;
    }
}

export default new UserServices()
