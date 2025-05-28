import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api'
const today = new Date().toISOString().split('T')[0]

const getNews = ({ skip = 0, limit = 10, date = today, source, category }) => {
    return axios.get(`${API_BASE_URL}/articles`, {
        params: {
            skip,
            limit,
            date,
            source,
            category
        }
    })
}

const getCategories = () => {
    return axios.get(`${API_BASE_URL}/categories`)
}

export default {
    getNews,
    getCategories
}