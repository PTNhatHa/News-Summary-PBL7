import "../styles/style.css"
import { LuCalendar, LuSearch } from "react-icons/lu";

const Header = () => {
    return (
        <>
            <div className="header-container">
                <p className="title">XNEWSDAY</p>
                <div className="wrap-header-btn">
                    <button className="header-btn header-btn-active">TRANG CHỦ</button>
                    <button className="header-btn">BÁO VNEXPRESS</button>
                    <button className="header-btn">BÁO TUỔI TRẺ</button>
                    <button className="header-btn">BÁO ĐÀ NẴNG</button>
                </div>
                <div className="wrap-header-right">
                    <button className="btn-choose-date">26/5/2025 <LuCalendar /></button>
                    <span className="horizontal-divide" />
                    <button className="btn-search"><LuSearch size={18} /></button>
                </div>
            </div>
        </>
    )
}

export default Header