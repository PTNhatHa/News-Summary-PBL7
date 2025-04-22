import Header from "../components/Header"
import { useState } from "react"
import { LuSearch } from "react-icons/lu";
import NewsItem from "../components/NewsItem";
import "../styles/style.css"

const Home = () => {
    const [search, setSearch] = useState("")
    return (
        <>
            {/* Header */}
            <Header />
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
                    <NewsItem />
                    <NewsItem />
                    <NewsItem />
                    <NewsItem />
                    <NewsItem />
                    <NewsItem />
                </div>
            </div>
        </>
    )
}
export default Home