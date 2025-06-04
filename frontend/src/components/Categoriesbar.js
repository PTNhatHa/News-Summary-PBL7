import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ArticleServices from "../services/ArticleServices";
import { useCategories } from "../context/CategoryContext ";

const CategoriesBar = ({ curentCategory = -1, setCurentCategory = () => { } }) => {
    const { listCategories } = useCategories()
    const [currentIndex, setCurrentIndex] = useState(curentCategory)
    const changeCategory = (index) => {
        setCurrentIndex(index)
        setCurentCategory(index)
    }
    return (
        <div className="wrap-all-categories">
            {/* <LuChevronLeft /> */}
            <div className="wrap-all-items">
                <div className={currentIndex == -1 ? "category-item-active" : "category-item"} onClick={() => changeCategory(-1)}>Tất cả</div>
                {listCategories?.map((cate, index) =>
                    <div key={index} className={currentIndex == index ? "category-item-active" : "category-item"} onClick={() => changeCategory(index)}>{cate}</div>
                )}
            </div>
            {/* <LuChevronRight /> */}
        </div>
    )
}
export default CategoriesBar