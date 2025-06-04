import HotNews from "../components/HotNews"
import CategoriesBar from "../components/Categoriesbar"
import { useState, useEffect } from "react"
import ArticleServices from "../services/ArticleServices"
import NewsItem from "../components/NewsItem"
import { useCategories } from "../context/CategoryContext "
import { useDate } from "../context/DateContext"
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.svg'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dayjs from 'dayjs';

const TuoiTrePage = () => {
    const { listCategories } = useCategories()
    const [ListHotNews, setListHotNews] = useState([])
    const [ListNews, setListNews] = useState([])
    const [curentCategory, setCurentCategory] = useState(-1)
    const [endIndex, setEndIndex] = useState(0)
    const [curentIndex, setCurentIndex] = useState(1)
    const { selectedDate } = useDate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ArticleServices.getNews({
                    skip: 0,
                    limit: 13,
                    date: selectedDate,
                    category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    source: "Tuổi Trẻ"
                })
                setListHotNews(response.data.articles.slice(0, 3))
                setListNews(response.data.articles.slice(3, 24))
                setEndIndex(Math.ceil((response.data.total_article - 3) / 5))
                setCurentIndex(1)
            } catch (error) {
                console.error("Lỗi get articles: ", error);
            }
        }
        setIsLoading(true)
        fetchData()
        setIsLoading(false)
    }, [curentCategory, selectedDate])

    const changeIndex = async (newIndex) => {
        setIsLoading(true)
        setCurentIndex(newIndex)
        try {
            const response = await ArticleServices.getNews({
                skip: (newIndex - 1) * 10 + 3,
                limit: 10,
                date: selectedDate,
                category: curentCategory == -1 ? "" : listCategories[curentCategory],
                source: "Tuổi Trẻ"
            })
            setListNews(response.data.articles)
        } catch (error) {
            console.error("Lỗi get articles: ", error);
        } finally {
            setIsLoading(false)
        }
    }
    return (
        isLoading ?
            <div className="loading-wrap">
                <AiOutlineLoading3Quarters className="loading" />
            </div>
            :
            ListHotNews.length == 0 ?
                <>
                    <div className="loading-wrap">Chưa có tin tức mới trong ngày {dayjs(selectedDate).format("DD/MM/YYYY")}</div>
                </>
                :
                <>
                    <CategoriesBar curentCategory={curentCategory} setCurentCategory={setCurentCategory} />
                    <div className="wrap-source-logo">
                        <img className="source-logo" src={LogoBaoTuoiTre} />
                    </div>
                    <HotNews ListHotNews={ListHotNews} />
                    <p className="title">BẢN TIN HÔM NAY</p>
                    <div className="wrap-todaynews">
                        <div style={{ width: '50%' }}>
                            {ListNews?.slice(0, Math.ceil(ListNews.length / 2)).map((item) =>
                                <NewsItem
                                    key={item.article_id}
                                    title={item.title}
                                    image_url={item.image_url}
                                    url={item.url}
                                    posted_date={item.posted_date}
                                    category={item.category}
                                    article_id={item.article_id}
                                    summary_id={item.summary_id}
                                    summary={item.summary}
                                    source={item.source}
                                />
                            )}
                        </div>
                        <div style={{ width: '50%' }}>
                            {ListNews?.slice(Math.ceil(ListNews.length / 2), 10).map((item) =>
                                <NewsItem
                                    key={item.article_id}
                                    title={item.title}
                                    image_url={item.image_url}
                                    url={item.url}
                                    posted_date={item.posted_date}
                                    category={item.category}
                                    article_id={item.article_id}
                                    summary_id={item.summary_id}
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
export default TuoiTrePage