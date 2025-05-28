import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import newsService from "../services/newsService";
import { useCategories } from "../context/CategoryContext ";

const CategoriesBar = ({ setCurentCategory = () => { } }) => {
    const { listCategories } = useCategories()
    const [currentIndex, setCurrentIndex] = useState(0)
    const changeCategory = (index, newChoice) => {
        setCurrentIndex(index)
        setCurentCategory(newChoice)
    }
    return (
        <div className="wrap-all-categories">
            {/* <LuChevronLeft /> */}
            <div className="wrap-all-items">
                <div className={currentIndex == -1 ? "category-item-active" : "category-item"} onClick={() => changeCategory(-1, "Tất cả")}>Tất cả</div>
                {listCategories?.map((cate, index) =>
                    <div key={index} className={currentIndex == index ? "category-item-active" : "category-item"} onClick={() => changeCategory(index, cate)}>{cate}</div>
                )}
            </div>
            {/* <LuChevronRight /> */}
        </div>
    )
}
export default CategoriesBar