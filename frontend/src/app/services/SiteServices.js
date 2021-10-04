import axios from 'axios'

import UserServices from './UserServices'

import { Backend_API_URL, Sites_URI, } from '../../AppConst'

class SiteServices {

    //Create new site
    async createNewSite(site) {
        var return_value = null
        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .post(Backend_API_URL + Sites_URI, site, config)
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

    //get all sites
    async getAllSites(site) {
        var return_value = null
        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .get(Backend_API_URL + Sites_URI, config)
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

    //delete site by id
    async deleteSiteByID(id) {
        var return_value = null

        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
        await axios
            .delete(Backend_API_URL + Sites_URI + '/' + id, config)
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

    //Get worksites by user
    async getAllWorksitesByUserID(id){
        var return_value = null
        const accessToken = window.localStorage.getItem('accessToken')

        var config = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }

        await axios
            .get(Backend_API_URL + Sites_URI+ `/user/${id}`, config)
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

export default new SiteServices()
