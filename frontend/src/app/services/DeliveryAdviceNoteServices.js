import axios from 'axios'

import UserServices from './UserServices'

import { Backend_API_URL, Delivery_advice_note_URI } from '../../AppConst'

class DeliveryAdviceNoteServices {
    //Create new delivery
    async createNewDelivery(order) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .post(Backend_API_URL + Delivery_advice_note_URI, order, config)
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
    //get all notes by Order id
    async getDeliveryNotesByOrderID(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .get(
                Backend_API_URL + Delivery_advice_note_URI + `/order/${id}`,
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
    //get note by id
    async getDeliveryNoteByID(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .get(Backend_API_URL + Delivery_advice_note_URI + `/${id}`, config)
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
    //get notes by user id
    async getDeliveryNotesByUserID() {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        //get logged in user
        const user = await UserServices.loggedInUserData()
        var id = user._id

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .get(
                Backend_API_URL + Delivery_advice_note_URI + `/user/${id}`,
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

    //user sign note
    async signDeliveryNote(data) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        //get logged in user
        const user = await UserServices.loggedInUserData()
        var id = user._id

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .put(
                Backend_API_URL + Delivery_advice_note_URI + `/sign/${id}`, data,
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
}

export default new DeliveryAdviceNoteServices()
