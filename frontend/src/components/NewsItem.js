import DefaultImg from '../assets/DefaultImg.jpg'
import LogoBaoDN from '../assets/LogoBaoDN.svg'
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.svg'
import LogoVNExpress from '../assets/LogoVNExpress.svg'

import "../styles/style.css"
import { LuClock } from "react-icons/lu";
import { BiLike, BiDislike } from "react-icons/bi";
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import NewsFeedback from './NewsFeedback'

const NewsItem = ({ title, image_url, url, posted_date, category, article_id, summary_id, summary, source = "DaNang" }) => {
    const [openOverlay, setOpenOverlay] = useState(false)

    useEffect(() => {
        if (openOverlay && url) {
            window.open(url, "_blank", "noopener,noreferrer")
        }
    }, [openOverlay])

    return (
        <>
            <article key={article_id} className="wrap-news-item" onClick={() => setOpenOverlay(true)}>
                <div
                    style={{
                        backgroundImage: image_url ? `url(${image_url})` : DefaultImg,
                    }}
                    className='thumbnail'
                >
                    <div className="category-name category-name-black" style={{ fontSize: '11px' }}>{category}</div>
                </div>
                <div className='wrap-content'>
                    <h2>{title}</h2>
                    <p className='description'>{summary}</p>
                    <div className='date-source'>
                        <span className="date">
                            <LuClock size={16} />
                            {dayjs(posted_date).format("HH:mm DD/MM/YYYY")}
                        </span>
                        <div className="category-name category-name-white" style={{ fontSize: '11px' }}>
                            <img className="mini-logo" src={source == "Đà Nẵng" ? LogoBaoDN : source == "VNExpress" ? LogoVNExpress : LogoBaoTuoiTre} />
                        </div>
                    </div>
                </div>
            </article>
            {openOverlay &&
                <div className='overlay'>
                    <NewsFeedback
                        summary_id={summary_id}
                        summary={summary}
                        title={title}
                        url={url}
                        source={source}
                        setOpenOverlay={setOpenOverlay}
                    />
                </div>
            }
        </>
    )
}

export default NewsItem