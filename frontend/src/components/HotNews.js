import { LuClock } from "react-icons/lu";
import dayjs from 'dayjs';
import NewsItem from "./NewsItem";
import LogoBaoDN from '../assets/LogoBaoDN.png'
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.png'
import LogoVNExpress from '../assets/LogoVNExpress.png'

const HotNews = ({ ListHotNews = [] }) => {

    return (
        <>
            <div className="container-hot-news">
                <p className="title">TIN MỚI NHẤT</p>
                <div className="wrap-hot-news">
                    <div className="left-hot-news" style={{
                        backgroundImage: `url(${ListHotNews[0]?.image_url ? ListHotNews[0].image_url : 'https://i.pinimg.com/736x/5e/60/19/5e60199ad2032df68c5385e230a241a8.jpg'})`,
                    }}>
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
                                    <img src={
                                        ListHotNews[0]?.source == "Đà Nẵng" ? LogoBaoDN
                                            : ListHotNews[0]?.source == "VNExpress" ? LogoVNExpress
                                                : LogoBaoTuoiTre} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-hot-news">
                        {ListHotNews?.slice(1, 3).map((item) =>
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
            </div>
        </>
    )
}
export default HotNews