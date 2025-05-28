import { createContext, useContext, useState, useEffect } from "react";
import newsService from "../services/newsService";

const CategoryContext = createContext()

export const useCategories = () => useContext(CategoryContext)

export const CategoryProvider = ({ children }) => {
    const [listCategories, setListCategories] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const response = await newsService.getCategories()
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