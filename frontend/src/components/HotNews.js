import { LuClock } from "react-icons/lu";
import dayjs from 'dayjs';
import NewsItem from "./NewsItem";
import LogoBaoDN from '../assets/LogoBaoDN.png'
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.png'
import LogoVNExpress from '../assets/LogoVNExpress.png'

const HotNews = () => {

    return (
        <>
            <div className="container-hot-news">
                <p className="title">TIN MỚI NHẤT</p>
                <div className="wrap-hot-news">
                    <div className="left-hot-news" style={{
                        backgroundImage: "url('https://i.pinimg.com/736x/5e/60/19/5e60199ad2032df68c5385e230a241a8.jpg')",
                    }}>
                        <div className='wrap-content main-hot-news'>
                            <div className="category-name category-name-white">Thời sự</div>
                            <h2 className="main-hot-news-content">Tiêu đề</h2>
                            <p className='description main-hot-news-content'>
                                "Snow White" được giới chuyên môn khen là bữa tiệc thị giác với hình ảnh và diễn xuất của người đẹp da màu Rachel Zegler trong vai Bạch Tuyết.
                            </p>
                            <div className='date-source'>
                                <span className="date main-hot-news-content">
                                    <LuClock size={16} />
                                    26/5/2025 10:24
                                    {/* {dayjs(posted_date).format("HH:mm DD/MM/YYYY")} */}
                                </span>
                                <div className="category-name category-name-white" style={{ fontSize: '11px' }}>
                                    <img src={true ? LogoBaoDN : false ? LogoVNExpress : LogoBaoTuoiTre} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-hot-news">
                        <NewsItem title={"Tiêu đề"} summary={"Tóm tắt nè"} source="DaNang" />
                        <NewsItem title={"Tiêu đề"} summary={"Tóm tắt nè"} source="VNExpress" />
                        <NewsItem title={"Tiêu đề"} summary={"Tóm tắt nè"} source="TuoiTre" />
                    </div>
                </div>
            </div>
        </>
    )
}
export default HotNews