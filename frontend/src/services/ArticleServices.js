import axios from 'axios'
import dayjs from 'dayjs';

const API_BASE_URL = 'http://127.0.0.1:8000/api/articles'
const today = new Date().toISOString().split('T')[0]

const getNews = ({ skip = 0, limit = 10, date = today, source, category }) => {
    const dateFormat = dayjs(date).format("YYYY-MM-DD");
    return axios.get(`${API_BASE_URL}/detail-articles`, {
        params: {
            skip,
            limit,
            date: dateFormat,
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
                start_date: dayjs(start_date).format("YYYY-MM-DD"),
                end_date: dayjs(end_date).format("YYYY-MM-DD")
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