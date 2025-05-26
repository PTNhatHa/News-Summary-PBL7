import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const CategoriesBar = () => {
    return (
        <div className="wrap-all-categories">
            <LuChevronLeft />
            <div className="wrap-all-items">
                <div className="category-item-active">Tất cả</div>
                <div className="category-item">Thời sự</div>
            </div>
            <LuChevronRight />
        </div>
    )
}
export default CategoriesBar