import axios from 'axios'

import UserServices from './UserServices'

import { Backend_API_URL, Invoice_URI } from '../../AppConst'

class InvoiceServices {
    //create new invoice
    async createNewInvoice(data) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .post(Backend_API_URL + Invoice_URI, data, config)
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
    //get all invoices by order id
    async getAllInvoicesBySupplierID() {
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
            .get(Backend_API_URL + Invoice_URI + `/supplier/${id}`, config)
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
    //get all invoices by order id
    async getAllInvoicesByOrderID(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .get(Backend_API_URL + Invoice_URI + `/order/${id}`, config)
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

    //get invoice by id
    async getInvoiceByID(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .get(Backend_API_URL + Invoice_URI + `/${id}`, config)
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
}

export default new InvoiceServices()
