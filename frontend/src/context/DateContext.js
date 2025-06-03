import { createContext, useContext, useState, useEffect } from "react";
import ArticleServices from "../services/ArticleServices";

const DateContext = createContext()

export const useDate = () => useContext(DateContext)

export const DateProvider = ({ children }) => {
    const [selectedDate, setSelectedDate] = useState(new Date())

    return (
        <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
            {children}
        </DateContext.Provider>
    )
}