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
    const [listNews, setListNews] = useState(["Start"])
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async () => {
        if (!search) {
            alert("Vui lòng nhập thông tin cần tìm!")
            return
        }
        try {
            // setIsLoading(true)
            // const response = await ArticleServices.searchNews({
            //     query: search,
            // })
            // setListNews(response.data.articles)
            setListNews([{ "title": "hehehe" }])
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
                        <input
                            placeholder="Tìm kiếm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch()
                                }
                            }}
                        />
                        <button className="btn-search-2" onClick={() => handleSearch()}><LuSearch size={18} /></button>
                    </div>
                </div>
                {isLoading ?
                    <div className="loading-wrap">
                        <AiOutlineLoading3Quarters className="loading" />
                    </div>
                    :
                    (listNews.length == 0 && listNews[0] !== "Start") ?
                        <div className="loading-wrap">
                            Không tìm thấy tin liên quan
                        </div>
                        :
                        listNews[0] !== "Start" &&
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
                        </div>
                }
            </div >
        </>
    )
}
export default SearchPage