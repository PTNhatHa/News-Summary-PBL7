import DefaultImg from '../assets/DefaultImg.jpg'
import "../styles/style.css"
import { LuClock } from "react-icons/lu";
const NewsItem = () => {
    return (
        <article className="wrap-news-item">
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
    )
}

export default NewsItem