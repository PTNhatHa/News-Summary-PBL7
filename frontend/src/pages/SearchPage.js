import Header from "../components/Header"
import { useEffect, useState } from "react"
import { LuSearch } from "react-icons/lu";
import NewsItem from "../components/NewsItem";
import "../styles/style.css"
import newsService from "../services/newsService";

const SearchPage = () => {
    const [search, setSearch] = useState("")
    const [listNews, setListNews] = useState([])
    useEffect(() => {
        newsService.getNews()
            .then((response) => {
                const sortedData = response.data.sort((a, b) =>
                    new Date(b.posted_date) - new Date(a.posted_date)
                )
                setListNews(sortedData)
            })
            .catch((error) => console.log(error))

    }, [])
    return (
        <>
            {/* Body */}
            <div className="body">
                <div className="container-search">
                    <div className="wrap-search">
                        <LuSearch size={24} />
                        <input placeholder="Tìm kiếm" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                {/* Tin tức */}
                <h1>BẢNG TIN HÔM NAY</h1>
                <div className="list-news">
                    {listNews.length > 0
                        ? listNews.map((item) =>
                            <NewsItem
                                title={item.title}
                                image_url={item.image_url}
                                url={item.url}
                                posted_date={item.posted_date}
                                id={item.id}
                                summary={item.summary}
                            />)
                        : ""
                    }
                </div>
            </div>
        </>
    )
}
export default SearchPage