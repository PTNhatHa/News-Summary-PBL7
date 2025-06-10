import HotNews from "../components/HotNews"
import CategoriesBar from "../components/Categoriesbar"
import { useState, useEffect } from "react"
import ArticleServices from "../services/ArticleServices"
import NewsItem from "../components/NewsItem"
import { useCategories } from "../context/CategoryContext "
import { useDate } from "../context/DateContext"
import LogoBaoDN from '../assets/LogoBaoDN.svg'
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dayjs from 'dayjs';

const DaNangPage = () => {
    const { listCategories } = useCategories()
    const [ListHotNews, setListHotNews] = useState([])
    const [ListNews, setListNews] = useState([])
    const [curentCategory, setCurentCategory] = useState(-1)
    const [endIndex, setEndIndex] = useState(0)
    const [curentIndex, setCurentIndex] = useState(1)
    const { selectedDate } = useDate()
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingCate, setIsLoadingCate] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const response = await ArticleServices.getNews({
                    skip: 0,
                    limit: 13,
                    date: selectedDate,
                    category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    source: "Đà Nẵng"
                })
                setListHotNews(response.data.articles.slice(0, 3))
                setListNews(response.data.articles.slice(3, 24))
                setEndIndex(Math.ceil((response.data.total_article - 3) / 10))
                setCurentIndex(1)
            } catch (error) {
                console.error("Lỗi get articles: ", error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [selectedDate])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingCate(true)
                const response = await ArticleServices.getNews({
                    skip: 0,
                    limit: 13,
                    date: selectedDate,
                    category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    source: "Đà Nẵng"
                })
                setListHotNews(response.data.articles.slice(0, 3))
                setListNews(response.data.articles.slice(3, 24))
                setEndIndex(Math.ceil((response.data.total_article - 3) / 10))
                setCurentIndex(1)
            } catch (error) {
                console.error("Lỗi get articles: ", error);
            } finally {
                setIsLoadingCate(false)
            }
        }
        fetchData()
    }, [curentCategory])

    const changeIndex = async (newIndex) => {
        setIsLoading(true)
        setCurentIndex(newIndex)
        try {
            const response = await ArticleServices.getNews({
                skip: (newIndex - 1) * 10 + 3,
                limit: 10,
                date: selectedDate,
                category: curentCategory == -1 ? "" : listCategories[curentCategory],
                source: "Đà Nẵng"
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
            <>
                <CategoriesBar curentCategory={curentCategory} setCurentCategory={setCurentCategory} />
                <div className="wrap-source-logo">
                    <img className="source-logo" src={LogoBaoDN} />
                </div>
                {
                    (ListHotNews.length == 0 && !isLoadingCate) ?
                        <>
                            <div className="loading-wrap">Chưa có tin tức mới trong ngày {dayjs(selectedDate).format("DD/MM/YYYY")}</div>
                        </>
                        :
                        <>
                            {isLoadingCate ?
                                <div className="loading-wrap">
                                    <AiOutlineLoading3Quarters className="loading" />
                                </div> :
                                <>
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
                                        {(endIndex <= 10) ?
                                            Array.from({ length: endIndex }, (_, i) => {

                                                return (
                                                    <button
                                                        key={i}
                                                        className={`btn-index ${curentIndex === i + 1 ? "btn-index-active" : ""}`}
                                                        onClick={() => changeIndex(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                )
                                            })
                                            :
                                            <>
                                                {curentIndex > 3 && (
                                                    <>
                                                        <button className="btn-index" onClick={() => changeIndex(1)}>1</button>
                                                        {curentIndex > 4 && <span>...</span>}
                                                    </>
                                                )}
                                                {Array.from({ length: endIndex }, (_, i) => i + 1)
                                                    .filter(i =>
                                                        (i >= curentIndex - 2 && i <= curentIndex + 2)
                                                    )
                                                    .map((i) => (
                                                        <button
                                                            key={i}
                                                            className={`btn-index ${curentIndex === i ? "btn-index-active" : ""}`}
                                                            onClick={() => changeIndex(i)}
                                                        >
                                                            {i}
                                                        </button>
                                                    ))}
                                                {curentIndex < endIndex - 2 && (
                                                    <>
                                                        {curentIndex < endIndex - 3 && <span>...</span>}
                                                        <button className="btn-index" onClick={() => changeIndex(endIndex)}>{endIndex}</button>
                                                    </>
                                                )}
                                            </>
                                        }
                                    </div>
                                </>}
                        </>
                }
            </>
    )
}
export default DaNangPage