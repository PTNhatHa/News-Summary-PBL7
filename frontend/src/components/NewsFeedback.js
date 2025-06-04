import { BiLike, BiDislike } from "react-icons/bi";
import { useEffect, useState } from 'react';
import FeedbackServices from "../services/FeedbackServices";

const NewsFeedback = ({ title, url, id, summary, source = "DaNang", setOpenOverlay = () => { } }) => {
    console.log("NewsFeedback: ", id);
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const [countFeedback, setCountFeedback] = useState({
        "summary_id": id,
        "likes": 0,
        "dislikes": 0
    })

    const fetchFeedbackCount = async () => {
        try {
            const response = await FeedbackServices.getFeedbackCount({ summary_id: id })
            if (response.status == 200) {
                setCountFeedback(response.data)
            }
        } catch (error) {
            console.log("Lỗi get feedback count: ", error);
        }
    }

    useEffect(() => {
        fetchFeedbackCount()
        // Gọi mỗi khi tab được focus lại
        window.addEventListener('focus', fetchFeedbackCount);

        return () => {
            window.removeEventListener('focus', fetchFeedbackCount);
        };
    }, [id])

    const handleLike = async () => {
        try {
            const response = await FeedbackServices.addLikeSummary({ summary_id: id })
            console.log("handleLike: ", response);
            if (response.status == 200) {
                setCountFeedback({
                    ...countFeedback,
                    "likes": countFeedback.likes + 1
                })
            }
        } catch (error) {
            console.log("Lỗi add like feedback: ", error);
        }
    }

    const handleDisLike = async () => {
        try {
            const response = await FeedbackServices.addDisLikeSummary({ summary_id: id })
            if (response.status == 200) {
                setCountFeedback({
                    ...countFeedback,
                    "dislikes": countFeedback.dislikes + 1
                })
            }
        } catch (error) {
            console.log("Lỗi add dislike feedback: ", error);
        }
    }

    return (
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
                        <div className={dislike ? "hidden" : "feedback-count"}>
                            <BiLike
                                size={24}
                                fill={like ? 'rgb(42, 140, 189)' : 'rgb(101, 104, 108)'}
                                onClick={() => {
                                    setLike(true)
                                    handleLike()
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                            <span>{countFeedback.likes}</span>
                        </div>
                        <div className={like ? "hidden" : "feedback-count"}>
                            <BiDislike
                                size={24}
                                fill={dislike ? 'rgb(42, 140, 189)' : 'rgb(101, 104, 108)'}
                                onClick={() => {
                                    setDislike(true)
                                    handleDisLike()
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                            <span>{countFeedback.dislikes}</span>
                        </div>

                    </div>
                </div>
            </div>
            <div className='wrap-bottom'>
                <button className='btn btn-cancel' onClick={() => setOpenOverlay(false)}>Đóng</button>
            </div>
        </div>
    )
}

export default NewsFeedback