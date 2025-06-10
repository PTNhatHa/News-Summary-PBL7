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
import illustration from "../assets/IllustrationNews.svg"
import LogoBaoDN from '../assets/LogoBaoDN.svg'
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.svg'
import LogoVNExpress from '../assets/LogoVNExpress.svg'

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
    const [isLoadingCate, setIsLoadingCate] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
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
            } finally {
                setIsLoadingCate(false)
            }
        }
        fetchData()
    }, [curentCategory])

    return (
        isLoading ?
            <div className="loading-wrap">
                <AiOutlineLoading3Quarters className="loading" />
            </div>
            :
            <>
                <CategoriesBar curentCategory={curentCategory} setCurentCategory={setCurentCategory} />
                <div className="intro-wrap">
                    <div className="intro-content">
                        <h1>XNEWSDAY</h1>
                        <h1>Hệ thống tổng hợp và tóm tắt tin tức</h1>
                        <p>Hệ thống tự động thu thập và tóm tắt tin tức hàng ngày từ các nguồn báo điện tử uy tín.<br />
                            Hệ thống được xây dựng phục vụ mục đích học tập và nghiên cứu, không sử dụng cho mục đích thương mại.
                        </p>
                        <div className="intro-content-category">
                            <div className="category-name category-name-white">
                                <img className="mini-logo" src={LogoVNExpress} />
                            </div>
                            <div className="category-name category-name-white">
                                <img className="mini-logo" src={LogoBaoTuoiTre} />
                            </div>
                            <div className="category-name category-name-white">
                                <img className="mini-logo" src={LogoBaoDN} />
                            </div>

                        </div>
                    </div>
                    <div className="intro-img">
                        <img src={illustration} />
                    </div>
                </div>
                {
                    ListHotNews.length == 0 ?
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
                                    <div className="container-news-souce">
                                        {ListVNExpress.length > 0 && <p className="title">BÁO VNEXPRESS</p>}
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
                                                            article_id={item.article_id}
                                                            summary_id={item.summary_id}
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
                                                        article_id={item.article_id}
                                                        summary_id={item.summary_id}
                                                        summary={item.summary}
                                                        source={item.source}
                                                    />
                                                )}
                                            </Slider>
                                        }
                                    </div>
                                    <div className="container-news-souce">
                                        {ListTuoiTre.length > 0 && <p className="title">BÁO TUỔI TRẺ</p>}
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
                                                            article_id={item.article_id}
                                                            summary_id={item.summary_id}
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
                                                        article_id={item.article_id}
                                                        summary_id={item.summary_id}
                                                        summary={item.summary}
                                                        source={item.source}
                                                    />
                                                )}
                                            </Slider>
                                        }
                                    </div>
                                    <div className="container-news-souce">
                                        {ListDaNang.length > 0 && <p className="title">BÁO ĐÀ NẴNG</p>}
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
                                                            article_id={item.article_id}
                                                            summary_id={item.summary_id}
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
                                                        article_id={item.article_id}
                                                        summary_id={item.summary_id}
                                                        summary={item.summary}
                                                        source={item.source}
                                                    />
                                                )}
                                            </Slider>
                                        }
                                    </div>
                                </>}
                        </>
                }
            </>
    )
}
export default Home