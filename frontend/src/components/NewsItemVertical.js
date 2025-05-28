import "../styles/style.css"
import { LuClock } from "react-icons/lu";
import { BiLike, BiDislike } from "react-icons/bi";
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import LogoBaoDN from '../assets/LogoBaoDN.png'
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.png'
import LogoVNExpress from '../assets/LogoVNExpress.png'

const NewsItemVertical = ({ title, image_url, url, posted_date, category, id, summary, source }) => {
    const [openOverlay, setOpenOverlay] = useState(false)
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    useEffect(() => {
        if (openOverlay && url) {
            window.open(url, "_blank", "noopener,noreferrer")
        }
    }, [openOverlay])

    return (
        <>
            <article key={id} className="wrap-news-item-vertical" onClick={() => setOpenOverlay(true)}>
                <div
                    style={{
                        backgroundImage: `url(${image_url ? image_url : 'https://i.pinimg.com/736x/5e/60/19/5e60199ad2032df68c5385e230a241a8.jpg'})`,
                    }}
                    className='thumbnail-vertical'
                >
                    <div className="category-name category-name-black">{category}</div>
                </div>
                <div className='wrap-content'>
                    <h2>{title}</h2>
                    <p className='description'>{summary}</p>
                    {/* <span className="date">
                        <LuClock size={16} />
                        {dayjs(posted_date).format("HH:mm DD/MM/YYYY")}
                    </span> */}
                    <div className='date-source'>
                        <span className="date">
                            <LuClock size={16} />
                            {dayjs(posted_date).format("HH:mm DD/MM/YYYY")}
                        </span>
                        <div className="category-name category-name-white" style={{ fontSize: '11px' }}>
                            <img src={source == "Đà Nẵng" ? LogoBaoDN : source == "VNExpress" ? LogoVNExpress : LogoBaoTuoiTre} />
                        </div>
                    </div>
                </div>
            </article>
            {openOverlay &&
                <div className='overlay'>
                    <div className='wrap-dialog'>
                        <h2>Bạn có hài lòng với đoạn tóm tắt này không?</h2>
                        <p>
                            {"Nguồn bài viết: "}
                            <a href={url} className='content-url' target="_blank" rel="noopener noreferrer">{title}</a>
                        </p>
                        <div className='wrap-feedback'>
                            <p>{summary}</p>
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
                            <button className='btn btn-feedback'>Gửi đánh giá</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default NewsItemVertical