import { createContext, useContext, useState, useEffect } from "react";
import ArticleServices from "../services/ArticleServices";

const CategoryContext = createContext()

export const useCategories = () => useContext(CategoryContext)

export const CategoryProvider = ({ children }) => {
    const [listCategories, setListCategories] = useState(["1111", "222", "33", "44", "55", "6", "77", "888",
        "99", "101010", "111111111111", "121212", "1313131", "14", "155555",])
    useEffect(() => {
        const fetchData = async () => {
            const response = await ArticleServices.getCategories()
            setListCategories(response.data)
        }
        fetchData()
    }, [])

    return (
        <CategoryContext.Provider value={{ listCategories }}>
            {children}
        </CategoryContext.Provider>
    )
}