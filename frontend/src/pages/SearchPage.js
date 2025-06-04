import Header from "../components/Header"
import { useEffect, useState } from "react"
import { LuSearch, LuMoveRight } from "react-icons/lu";
import NewsItem from "../components/NewsItem";
import "../styles/style.css"
import ArticleServices from "../services/ArticleServices";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDate } from "../context/DateContext";
import dayjs from 'dayjs';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const SearchPage = () => {
    const { selectedDate, setSelectedDate } = useDate()
    const [search, setSearch] = useState("")
    const [startDate, setStartDate] = useState(selectedDate)
    const [endDate, setEndDate] = useState(selectedDate)
    const [listNews, setListNews] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async () => {
        if (startDate >= endDate) {
            alert("Vui lòng chọn ngày bắt đầu trước ngày kết thúc!")
            return
        }
        if (!search) {
            alert("Vui lòng nhập thông tin cần tìm!")
            return
        }
        try {
            setIsLoading(true)
            const response = await ArticleServices.searchNews({
                query: search,
                start_date: startDate,
                end_date: endDate,
            })
            setListNews(response.data.articles)
        } catch (error) {
            console.error("Lỗi get articles: ", error);
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            {/* Body */}
            <div className="body">
                {/* Tin tức */}
                <h1>TÌM KIẾM TIN TỨC</h1>
                <div className="container-search">
                    <div className="wrap-search">
                        <input placeholder="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button className="btn-search-2" onClick={() => handleSearch()}><LuSearch size={18} /></button>
                    </div>
                    <div className="wrap-start-end">
                        <DatePicker
                            className="btn-start-end"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                        />
                        <LuMoveRight />
                        <DatePicker
                            className="btn-start-end"
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                        />
                    </div>
                </div>
                {isLoading ?
                    <div className="loading-wrap">
                        <AiOutlineLoading3Quarters className="loading" />
                    </div>
                    :
                    listNews.length == 0 ?
                        <div className="loading-wrap">
                            Không tìm thấy tin liên quan
                        </div>
                        :
                        <div className="list-news">
                            {listNews.length > 0
                                ? listNews.map((item) =>
                                    <NewsItem
                                        title={item.title}
                                        image_url={item.image_url}
                                        url={item.url}
                                        posted_date={item.posted_date}
                                        category={item.category}
                                        article_id={item.article_id}
                                        summary_id={item.summary_id}
                                        summary={item.summary}
                                        source={item.source}
                                    />)
                                : ""
                            }
                        </div>}
            </div >
        </>
    )
}
export default SearchPage