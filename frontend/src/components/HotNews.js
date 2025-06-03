import { LuClock } from "react-icons/lu";
import { BiLike, BiDislike } from "react-icons/bi";
import dayjs from 'dayjs';
import NewsItem from "./NewsItem";
import LogoBaoDN from '../assets/LogoBaoDN.svg'
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.svg'
import LogoVNExpress from '../assets/LogoVNExpress.svg'
import DefaultImg from '../assets/DefaultImg.jpg'
import { useState, useEffect } from "react";

const HotNews = ({ ListHotNews = [] }) => {
    console.log(ListHotNews);
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
                            )
                        }
                        )}
                    </div>
                </div>
            </div>
            {openOverlay &&
                <div className='overlay'>
                    <div className='wrap-dialog'>
                        <h2>Bạn có hài lòng với đoạn tóm tắt này không?</h2>
                        <p>
                            {"Nguồn bài viết: "}
                            <a href={ListHotNews[0]?.url} className='content-url' target="_blank" rel="noopener noreferrer">{ListHotNews[0]?.title}</a>
                        </p>
                        <div className='wrap-feedback'>
                            <p>{ListHotNews[0]?.summary}</p>
                            <div className='divide' />
                            <div className='feedback-choice'>
                                <p>Đánh giá của bạn giúp chúng tôi cải thiện chất lượng tóm tắt. Xin cảm ơn!</p>
                                <div className='like-dislike'>
                                    <BiLike
                                        size={24}
                                        fill={like ? 'rgb(42, 140, 189)' : 'rgb(101, 104, 108)'}
                                        onClick={() => {
                                            if (!like && dislike) {
                                                setDislike(!dislike)
                                            }
                                            setLike(!like)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <BiDislike
                                        size={24}
                                        fill={dislike ? 'rgb(42, 140, 189)' : 'rgb(101, 104, 108)'}
                                        onClick={() => {
                                            if (like && !dislike) {
                                                setLike(!like)
                                            }
                                            setDislike(!dislike)
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='wrap-bottom'>
                            <button className='btn btn-cancel' onClick={() => setOpenOverlay(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
export default HotNews