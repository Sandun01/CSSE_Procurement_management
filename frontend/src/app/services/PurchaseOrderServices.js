import axios from 'axios'

import { Backend_API_URL, Purchase_Order_URI } from '../../AppConst'
import UserServices from './UserServices'

class PurchaseOrderServices {
    //create requisition
    async createRequisition(data) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .post(Backend_API_URL + Purchase_Order_URI, data, config)
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

    //Get active requisition of site manager by id
    async getCurrentActiveRequisition(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .get(
                Backend_API_URL +
                    Purchase_Order_URI +
                    `/site_manager/saved/${id}`,
                config
            )
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

    //add item to requisition
    async addItemToRequisition(data, id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .put(
                Backend_API_URL + Purchase_Order_URI + `/items/add/${id}`,
                data,
                config
            )
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

    //edit item to requisition
    async editItemDetailsInRequisition(data, id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .put(
                Backend_API_URL + Purchase_Order_URI + `/items/edit/${id}`,
                data,
                config
            )
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

    //delete item to requisition
    async deleteItemInRequisition(fData, id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        await axios
            .delete(
                Backend_API_URL + Purchase_Order_URI + `/items/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    data: fData,
                }
            )
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

    //Add comment and finalize form
    async finalizeForm(data, id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        //get logged in user
        const user = await UserServices.loggedInUserData()
        const userID = user._id

        var currentdate = new Date()
        var data_time =
            currentdate.getDate() +
            '/' +
            (currentdate.getMonth() + 1) +
            '/' +
            currentdate.getFullYear() +
            '   ' +
            currentdate.getHours() +
            ':' +
            currentdate.getMinutes() +
            ':' +
            currentdate.getSeconds()

        data.addedUser = userID
        data.dateTime = data_time

        await axios
            .put(
                Backend_API_URL +
                    Purchase_Order_URI +
                    `/comment/finalize/${id}`,
                data,
                config
            )
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

    //add supervisor/P-staff comment
    async staffAddComment(data, id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        //get logged in user
        const user = await UserServices.loggedInUserData()
        const userID = user._id

        var currentdate = new Date()
        var data_time =
            currentdate.getDate() +
            '/' +
            (currentdate.getMonth() + 1) +
            '/' +
            currentdate.getFullYear() +
            '   ' +
            currentdate.getHours() +
            ':' +
            currentdate.getMinutes() +
            ':' +
            currentdate.getSeconds()

        data.addedUser = userID
        data.dateTime = data_time

        await axios
            .put(
                Backend_API_URL + Purchase_Order_URI + `/comment/add/${id}`,
                data,
                config
            )
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

    //get all requisitions of site manager
    async getAllRequisitionsBySiteManager() {
        var return_value = null

        //get logged in user
        const user = await UserServices.loggedInUserData()
        var id = user._id

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .get(
                Backend_API_URL +
                    Purchase_Order_URI +
                    `/site_manager/all/${id}`,
                config
            )
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

    //get all requisitions p_Staff/supervisor/super admin
    async getAllRequisitions() {
        var return_value = null
        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .get(Backend_API_URL + Purchase_Order_URI + `/all`, config)
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

    //get requisition by id
    async getRequisitionByID(id) {
        var return_value = null
        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .get(Backend_API_URL + Purchase_Order_URI + `/${id}`, config)
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

    //delete requisition
    async deleteRequisitionByID(id) {
        var return_value = null
        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .delete(Backend_API_URL + Purchase_Order_URI + '/' + id, config)
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

    //approve / reject requisition
    async approveOrRejectOrder(data, id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .put(
                Backend_API_URL + Purchase_Order_URI + `/status/${id}`,
                data,
                config
            )
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

    //get all requisitions of site manager
    async getAllPurchaseOrderBySupplier() {
        var return_value = null

        //get logged in user
        const user = await UserServices.loggedInUserData()
        var id = user._id

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .get(
                Backend_API_URL + Purchase_Order_URI + `/supplier/${id}`,
                config
            )
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

    //update checked status of order site manager
    async updateCheckedStatus(data, id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .put(
                Backend_API_URL + Purchase_Order_URI + `/checked/${id}`,
                data,
                config
            )
            .then((res) => {
                return_value = res.data
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }
}

export default new PurchaseOrderServices()
