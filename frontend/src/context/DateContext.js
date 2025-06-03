import { createContext, useContext, useState, useEffect } from "react";
import newsService from "../services/newsService";

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