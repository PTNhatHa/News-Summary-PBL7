import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000/api/feedbacks'

const getFeedbackCount = ({ summary_id }) => {
    return axios.get(`${API_BASE_URL}/count/${summary_id}`)
}

const addLikeSummary = ({ summary_id }) => {
    return axios.post(`${API_BASE_URL}/like/${summary_id}`)
}

const addDisLikeSummary = ({ summary_id }) => {
    return axios.post(`${API_BASE_URL}/dislike/${summary_id}`)
}

export default {
    getFeedbackCount,
    addLikeSummary,
    addDisLikeSummary
}