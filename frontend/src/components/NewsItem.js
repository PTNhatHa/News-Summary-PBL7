import DefaultImg from '../assets/DefaultImg.jpg'
import "../styles/style.css"
import { LuClock } from "react-icons/lu";
import { BiLike, BiDislike } from "react-icons/bi";
import { useState } from 'react';

const NewsItem = ({ }) => {
    const [openOverlay, setOpenOverlay] = useState(false)
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)

    return (
        <>
            <article className="wrap-news-item" onClick={() => setOpenOverlay(true)}>
                <img src={DefaultImg} className='thumbnail' />
                <div className='wrap-content'>
                    <h2>Phim 'Nàng Bạch Tuyết' nhận mưa lời khen</h2>
                    <p className='description'>
                        "Snow White" được giới chuyên môn khen là bữa tiệc thị giác với hình ảnh và diễn xuất của người đẹp da màu Rachel Zegler trong vai Bạch Tuyết.
                    </p>
                    <span className="date">
                        <LuClock size={16} />
                        12 giờ trước
                    </span>
                </div>
            </article>
            {openOverlay &&
                <div className='overlay'>
                    <div className='wrap-dialog'>
                        <h2>Bạn có hài lòng với đoạn tóm tắt này không?</h2>
                        <p>Nguồn bài viết: <span className='content-url'>Phim 'Nàng Bạch Tuyết' nhận mưa lời khen</span></p>
                        <div className='wrap-feedback'>
                            <p>
                                "Snow White" được giới chuyên môn khen là bữa tiệc thị giác với hình ảnh và diễn xuất của người đẹp da màu Rachel Zegler trong vai Bạch Tuyết.
                            </p>
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
                            <button className='btn btn-cancel' onClick={() => setOpenOverlay(false)}>Hủy</button>
                            <button className='btn btn-feedback'>Gửi đánh giá</button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default NewsItem