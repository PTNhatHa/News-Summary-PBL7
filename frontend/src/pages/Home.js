import HotNews from "../components/HotNews"
import NewsItemVertical from "../components/NewsItemVertical"
import "../styles/style.css"

const Home = () => {
    const ListHotNews = [
        {

        }
    ]
    return (
        <>
            <HotNews />
            <div className="container-news-souce">
                <p className="title">BÁO VNEXPRESS</p>
                <div className="list-news-vertical">
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                </div>
            </div>
            <div className="container-news-souce">
                <p className="title">BÁO TUỔI TRẺ</p>
                <div className="list-news-vertical">
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                </div>
            </div>
            <div className="container-news-souce">
                <p className="title">BÁO ĐÀ NẴNG</p>
                <div className="list-news-vertical">
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                    <NewsItemVertical title={"Tiêu đề"} summary={"Tóm tắt nè"} />
                </div>
            </div>
        </>
    )
}
export default Home