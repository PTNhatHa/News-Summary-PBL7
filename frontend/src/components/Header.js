import { NavLink } from "react-router-dom";
import "../styles/style.css"
import { LuCalendar, LuSearch } from "react-icons/lu";

const Header = () => {
    return (
        <>
            <div className="header-container">
                <p className="title">XNEWSDAY</p>
                <div className="wrap-header-btn">
                    <NavLink className={({ isActive }) => isActive ? "header-btn header-btn-active" : "header-btn"} to="/">TRANG CHỦ</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "header-btn header-btn-active" : "header-btn"} to="/vnexpress">BÁO VNEXPRESS</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "header-btn header-btn-active" : "header-btn"} to="/tuoitre">BÁO TUỔI TRẺ</NavLink>
                    <NavLink className={({ isActive }) => isActive ? "header-btn header-btn-active" : "header-btn"} to="/danang">BÁO ĐÀ NẴNG</NavLink>
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