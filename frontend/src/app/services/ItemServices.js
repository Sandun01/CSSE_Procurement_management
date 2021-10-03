import axios from 'axios'

import UserServices from './UserServices'

import { Backend_API_URL, Items_URI } from '../../AppConst'

class ItemServices {
    //Add new item
    async addNewItem(item) {
        var return_value = null

        const user = await UserServices.loggedInUserData()
        item.addedUser = user._id

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .post(Backend_API_URL + Items_URI, item, config)
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

    //Update item
    async updateItem(item) {
        var return_value = null

        const user = await UserServices.loggedInUserData()
        item.updatedUser = user._id

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        var id = item._id

        await axios
            .put(Backend_API_URL + Items_URI + `/${id}`, item, config)
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

    //All items
    async getAllItems() {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .get(Backend_API_URL + Items_URI, config)
            .then((res) => {
                if (res.data) {
                    // console.log(res);
                    return_value = res
                }
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }

    //get item by id
    async getItemById(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .get(Backend_API_URL + Items_URI + '/' + id, config)
            .then((res) => {
                if (res.data) {
                    // console.log(res);
                    return_value = res
                }
            })
            .catch((error) => {
                console.log(error)
                return null
            })

        return return_value
    }

    //delete item by id
    async deleteItemByID(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .delete(Backend_API_URL + Items_URI + '/' + id, config)
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
    
}

export default new ItemServices()
