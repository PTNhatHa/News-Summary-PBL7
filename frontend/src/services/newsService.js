import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const getNews = () => {
    return axios.get(`${API_BASE_URL}/articles`)
}

export default {
    getNews
}