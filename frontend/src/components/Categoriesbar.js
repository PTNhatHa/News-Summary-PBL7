import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import ArticleServices from "../services/ArticleServices";
import { useCategories } from "../context/CategoryContext ";

const CategoriesBar = ({ curentCategory = -1, setCurentCategory = () => { } }) => {
    const numberCate = 7
    const { listCategories } = useCategories()
    const [currentIndexSlice, setCurrentIndexSlice] = useState(1)
    const [currentIndex, setCurrentIndex] = useState(curentCategory)
    const changeCategory = (index) => {
        setCurrentIndex(index)
        setCurentCategory(index)
    }
    return (
        <div className="wrap-all-categories">
            {currentIndexSlice !== 1 &&
                <LuChevronLeft onClick={() => setCurrentIndexSlice(currentIndexSlice - 1)} size={24} className="cate-arrow" />
            }
            <div className="wrap-all-items">
                {currentIndexSlice === 1 && <div className={currentIndex == -1 ? "category-item-active" : "category-item"} onClick={() => changeCategory(-1)}>Tất cả</div>}
                {listCategories?.slice((currentIndexSlice - 1) * numberCate, currentIndexSlice * numberCate).map((cate, index) =>
                    <div key={index} className={currentIndex == ((currentIndexSlice - 1) * numberCate + index) ? "category-item-active" : "category-item"} onClick={() => changeCategory((currentIndexSlice - 1) * numberCate + index)}>{cate}</div>
                )}
            </div>
            {currentIndexSlice < Math.ceil(listCategories.length / numberCate) &&
                <LuChevronRight onClick={() => setCurrentIndexSlice(currentIndexSlice + 1)} size={24} className="cate-arrow" />
            }
        </div>
    )
}
export default CategoriesBar