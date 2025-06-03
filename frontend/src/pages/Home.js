import HotNews from "../components/HotNews"
import NewsItemVertical from "../components/NewsItemVertical"
import CategoriesBar from "../components/Categoriesbar"
import "../styles/style.css"
import { useEffect, useState } from "react"
import ArticleServices from "../services/ArticleServices"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useCategories } from "../context/CategoryContext "
import { useDate } from "../context/DateContext"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import dayjs from 'dayjs';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,              //  Bật auto chạy
    autoplaySpeed: 3000,         //  3 giây 1 lần
    pauseOnHover: true,          //  Dừng khi hover
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            }
        }
    ]
};

const Home = () => {
    const { listCategories } = useCategories()
    const { selectedDate } = useDate()
    const [ListHotNews, setListHotNews] = useState([])
    const [ListVNExpress, setListVNExpress] = useState([])
    const [ListTuoiTre, setListTuoiTre] = useState([])
    const [ListDaNang, setListDaNang] = useState([])
    const [curentCategory, setCurentCategory] = useState(-1)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    responseHotNews,
                    responseVNExpress,
                    responseTuoiTre,
                    responseDaNang
                ] = await Promise.all([
                    ArticleServices.getNews({
                        skip: 0,
                        limit: 3,
                        date: selectedDate,
                        category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    }),
                    ArticleServices.getNews({
                        skip: 0,
                        limit: 12,
                        date: selectedDate,
                        source: "VNExpress",
                        category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    }),
                    ArticleServices.getNews({
                        skip: 0,
                        limit: 12,
                        date: selectedDate,
                        source: "Tuổi Trẻ",
                        category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    }),
                    ArticleServices.getNews({
                        skip: 0,
                        limit: 12,
                        date: selectedDate,
                        source: "Đà Nẵng",
                        category: curentCategory == -1 ? "" : listCategories[curentCategory],
                    })
                ])
                setListHotNews(responseHotNews.data.articles)
                setListVNExpress(responseVNExpress.data.articles)
                setListTuoiTre(responseTuoiTre.data.articles)
                setListDaNang(responseDaNang.data.articles)
            } catch (error) {
                console.error("Lỗi get articles: ", error);
            }
        }
        setIsLoading(true)
        fetchData()
        setIsLoading(false)
    }, [curentCategory, selectedDate])

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
                    <HotNews ListHotNews={ListHotNews} />
                    <div className="container-news-souce">
                        <p className="title">BÁO VNEXPRESS</p>
                        {ListVNExpress.length < 4 ?
                            <div {...settings} className="list-news-vertical">
                                {ListVNExpress?.map((item) =>
                                    <div style={{ width: '25%' }} key={item.id}>
                                        <NewsItemVertical
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
                                    </div>
                                )}
                            </div>
                            :
                            <Slider {...settings} className="list-news-vertical">
                                {ListVNExpress?.map((item) =>
                                    <NewsItemVertical
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
                            </Slider>
                        }
                    </div>
                    <div className="container-news-souce">
                        <p className="title">BÁO TUỔI TRẺ</p>
                        {ListTuoiTre.length < 4 ?
                            <div {...settings} className="list-news-vertical">
                                {ListTuoiTre?.map((item) =>
                                    <div style={{ width: '25%' }} key={item.id}>
                                        <NewsItemVertical
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
                                    </div>
                                )}
                            </div>
                            :
                            <Slider {...settings} className="list-news-vertical">
                                {ListTuoiTre?.map((item) =>
                                    <NewsItemVertical
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
                            </Slider>
                        }
                    </div>
                    <div className="container-news-souce">
                        <p className="title">BÁO ĐÀ NẴNG</p>
                        {ListDaNang.length < 4 ?
                            <div {...settings} className="list-news-vertical">
                                {ListDaNang?.map((item) =>
                                    <div style={{ width: '25%' }} key={item.id}>
                                        <NewsItemVertical
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
                                    </div>
                                )}
                            </div>
                            :
                            <Slider {...settings} className="list-news-vertical">
                                {ListDaNang?.map((item) =>
                                    <NewsItemVertical
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
                            </Slider>
                        }
                    </div>
                </>
    )
}
export default Home