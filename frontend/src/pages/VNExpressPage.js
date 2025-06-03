import HotNews from "../components/HotNews"
import CategoriesBar from "../components/Categoriesbar"
import { useState, useEffect } from "react"
import newsService from "../services/newsService"
import NewsItem from "../components/NewsItem"
import { useCategories } from "../context/CategoryContext "
import { useDate } from "../context/DateContext"
import LogoVNExpress from '../assets/LogoVNExpress.svg'

const VNExpressPage = () => {
    const { listCategories } = useCategories()
    const [ListHotNews, setListHotNews] = useState([])
    const [ListNews, setListNews] = useState([])
    const [curentCategory, setCurentCategory] = useState(-1)
    const [endIndex, setEndIndex] = useState(5)
    const [curentIndex, setCurentIndex] = useState(1)
    const { selectedDate } = useDate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await newsService.getNews({
                    skip: 0,
                    limit: 5,
                    date: selectedDate,
                    category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    source: "VNExpress"
                })
                setListHotNews(response.data.articles.slice(0, 3))
                setListNews(response.data.articles.slice(3, 24))
                setEndIndex(Math.ceil((response.data.total_article - 3) / 5))
                setCurentIndex(1)
            } catch (error) {
                console.error("Lỗi get articles: ", error);
            }
        }
        fetchData()
    }, [curentCategory, selectedDate])

    const changeIndex = async (newIndex) => {
        setCurentIndex(newIndex)
        try {
            const response = await newsService.getNews({
                skip: (newIndex - 1) * 2 + 3,
                limit: 2,
                date: selectedDate,
                category: curentCategory == -1 ? "" : listCategories[curentCategory],
                source: "VNExpress"
            })
            setListNews(response.data.articles)
        } catch (error) {
            console.error("Lỗi get articles: ", error);
        }
    }

    return (
        <>
            <CategoriesBar curentCategory={curentCategory} setCurentCategory={setCurentCategory} />
            <div className="wrap-source-logo">
                <img className="source-logo" src={LogoVNExpress} />
            </div>
            <HotNews ListHotNews={ListHotNews} />
            <p className="title">BẢN TIN HÔM NAY</p>
            <div className="wrap-todaynews">
                <div style={{ width: '50%' }}>
                    {ListNews?.slice(0, Math.ceil(ListNews.length / 2)).map((item) =>
                        <NewsItem
                            key={item.id}
                            title={item.title}
                            image_url={item.image_url}
                            url={item.url}
                            posted_date={item.posted_date}
                            category={item.category}
                            id={item.id}
                            summary={item.summary}
                            source={item.source}
                        />
                    )}
                </div>
                <div style={{ width: '50%' }}>
                    {ListNews?.slice(Math.ceil(ListNews.length / 2), 10).map((item) =>
                        <NewsItem
                            key={item.id}
                            title={item.title}
                            image_url={item.image_url}
                            url={item.url}
                            posted_date={item.posted_date}
                            category={item.category}
                            id={item.id}
                            summary={item.summary}
                            source={item.source}
                        />
                    )}
                </div>
            </div>
            <div className="wrap-list-index">
                {Array.from({ length: endIndex }, (_, i) => (
                    <button
                        key={i}
                        className={`btn-index ${curentIndex === i + 1 ? "btn-index-active" : ""}`}
                        onClick={() => changeIndex(i + 1)}
                    >{i + 1}</button>
                ))}
            </div>
        </>
    )
}
export default VNExpressPage