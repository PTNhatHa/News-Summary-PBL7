import HotNews from "../components/HotNews"
import CategoriesBar from "../components/Categoriesbar"
import { useState, useEffect } from "react"
import newsService from "../services/newsService"
import NewsItem from "../components/NewsItem"
import { useCategories } from "../context/CategoryContext "

const VNExpressPage = () => {
    const { listCategories } = useCategories()
    const [ListHotNews, setListHotNews] = useState([])
    const [ListNews, setListNews] = useState([])
    const [curentCategory, setCurentCategory] = useState(-1)

    useEffect(() => {
        const fetchData = async () => {
            const today = "2025-05-25"
            try {
                const response = await newsService.getNews({
                    skip: 0,
                    limit: 13,
                    date: today,
                    category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    source: "VNExpress"
                })
                setListHotNews(response.data.articles.slice(0, 3))
                setListNews(response.data.articles.slice(3, 24))
            } catch (error) {
                console.error("Lỗi get articles: ", error);
            }
        }
        fetchData()
    }, [curentCategory])

    return (
        <>
            <CategoriesBar curentCategory={curentCategory} setCurentCategory={setCurentCategory} />
            <HotNews ListHotNews={ListHotNews} />
            <p className="title">BẢN TIN HÔM NAY</p>
            <div className="wrap-todaynews">
                <div>
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
                <div>
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
        </>
    )
}
export default VNExpressPage