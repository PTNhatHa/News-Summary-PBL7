import { LuClock } from "react-icons/lu";
import { BiLike, BiDislike } from "react-icons/bi";
import dayjs from 'dayjs';
import NewsItem from "./NewsItem";
import LogoBaoDN from '../assets/LogoBaoDN.svg'
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.svg'
import LogoVNExpress from '../assets/LogoVNExpress.svg'
import DefaultImg from '../assets/DefaultImg.jpg'
import { useState, useEffect } from "react";
import NewsFeedback from "./NewsFeedback";

const HotNews = ({ ListHotNews = [] }) => {
    const [openOverlay, setOpenOverlay] = useState(false)
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    useEffect(() => {
        if (openOverlay && ListHotNews[0]?.url) {
            window.open(ListHotNews[0]?.url, "_blank", "noopener,noreferrer")
        }
    }, [openOverlay])
    return (
        <>
            <div className="container-hot-news">
                <p className="title">TIN MỚI NHẤT</p>
                {ListHotNews.length > 0 &&
                    <div className="wrap-hot-news">
                        <div
                            className="left-hot-news"
                            style={{
                                backgroundImage: ListHotNews[0]?.image_url ? `url(${ListHotNews[0].image_url})` : DefaultImg,
                            }}
                            onClick={() => setOpenOverlay(true)}
                        >
                            <div className='wrap-content main-hot-news'>
                                <div className="category-name category-name-white">{ListHotNews[0]?.category}</div>
                                <h2 className="main-hot-news-content">{ListHotNews[0]?.title}</h2>
                                <p className='description main-hot-news-content'>{ListHotNews[0]?.summary}</p>
                                <div className='date-source'>
                                    <span className="date main-hot-news-content">
                                        <LuClock size={16} />
                                        {dayjs(ListHotNews[0]?.posted_date).format("HH:mm DD/MM/YYYY")}
                                    </span>
                                    <div className="category-name category-name-white" style={{ fontSize: '11px' }}>
                                        <img
                                            className="mini-logo"
                                            src={
                                                ListHotNews[0]?.source == "Đà Nẵng" ? LogoBaoDN
                                                    : ListHotNews[0]?.source == "VNExpress" ? LogoVNExpress
                                                        : LogoBaoTuoiTre} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="right-hot-news">
                            {ListHotNews?.slice(1, 3).map((item) => {
                                console.log("item.category: ", item.category);
                                return (
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
                                )
                            }
                            )}
                        </div>
                    </div>
                }
            </div>
            {openOverlay &&
                <div className='overlay'>
                    <NewsFeedback
                        summary_id={ListHotNews[0]?.summary_id}
                        summary={ListHotNews[0]?.summary}
                        title={ListHotNews[0]?.title}
                        url={ListHotNews[0]?.url}
                        source={ListHotNews[0]?.source}
                        setOpenOverlay={setOpenOverlay}
                    />
                </div>
            }
        </>
    )
}
export default HotNews