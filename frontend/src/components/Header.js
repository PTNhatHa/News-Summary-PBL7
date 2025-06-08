import { NavLink } from "react-router-dom";
import "../styles/style.css"
import { LuCalendar, LuSearch } from "react-icons/lu";
import { useDate } from "../context/DateContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Header = () => {
    const { selectedDate, setSelectedDate } = useDate()

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
                    <DatePicker
                        className="btn-choose-date"
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                    />
                    <span className="horizontal-divide" />
                    <NavLink className={({ isActive }) => isActive ? "btn-search-active" : "btn-search"} to='/search' ><LuSearch size={18} /></NavLink>
                </div>
            </div>
        </>
    )
}

export default Header