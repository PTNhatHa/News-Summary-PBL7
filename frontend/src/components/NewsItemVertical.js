import "../styles/style.css"
import { LuClock } from "react-icons/lu";
import { BiLike, BiDislike } from "react-icons/bi";
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import LogoBaoDN from '../assets/LogoBaoDN.svg'
import LogoBaoTuoiTre from '../assets/LogoBaoTuoiTre.svg'
import LogoVNExpress from '../assets/LogoVNExpress.svg'
import DefaultImg from '../assets/DefaultImg.jpg'
import NewsFeedback from "./NewsFeedback";

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
                        backgroundImage: image_url ? `url(${image_url})` : DefaultImg,
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
                            <img className="mini-logo" src={source == "Đà Nẵng" ? LogoBaoDN : source == "VNExpress" ? LogoVNExpress : LogoBaoTuoiTre} />
                        </div>
                    </div>
                </div>
            </article>
            {openOverlay &&
                <div className='overlay'>
                    <NewsFeedback
                        id={id}
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

export default NewsItemVertical