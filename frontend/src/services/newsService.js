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

const searchNews = ({ query, start_date, end_date }) => {
    return axios.post(`${API_BASE_URL}/retrieve`,
        {
            query: query
        },
        {
            params: {
                start_date: start_date,
                end_date: end_date
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}

export default {
    getNews,
    getCategories,
    searchNews
}