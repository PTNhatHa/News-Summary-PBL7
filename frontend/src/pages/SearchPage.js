import Header from "../components/Header"
import { useEffect, useState } from "react"
import { LuSearch, LuMoveRight } from "react-icons/lu";
import NewsItem from "../components/NewsItem";
import "../styles/style.css"
import newsService from "../services/newsService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDate } from "../context/DateContext";
import dayjs from 'dayjs';

const SearchPage = () => {
    const { selectedDate, setSelectedDate } = useDate()
    const [search, setSearch] = useState("")
    const [startDate, setStartDate] = useState(selectedDate)
    const [endDate, setEndDate] = useState(selectedDate)

    const [listNews, setListNews] = useState([])
    const handleSearch = async () => {
        if (startDate > endDate) {
            alert("Vui lòng chọn ngày bắt đầu trước ngày kết thúc!")
            return
        }
        if (!search) {
            alert("Vui lòng nhập thông tin cần tìm!")
            return
        }
        try {
            const response = await newsService.searchNews({
                query: search,
                start_date: startDate,
                end_date: endDate,
            })
            setListNews(response.data.articles)
        } catch (error) {
            console.error("Lỗi get articles: ", error);
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
                <div className="list-news">
                    {listNews.length > 0
                        ? listNews.map((item) =>
                            <NewsItem
                                title={item.title}
                                image_url={item.image_url}
                                url={item.url}
                                posted_date={item.posted_date}
                                category={item.category}
                                id={item.id}
                                summary={item.summary}
                                source={item.source}
                            />)
                        : ""
                    }
                </div>
            </div>
        </>
    )
}
export default SearchPage