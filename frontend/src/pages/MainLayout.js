import { Outlet } from "react-router-dom"
import CategoriesBar from "../components/Categoriesbar"
import Header from "../components/Header"

const MainLayout = () => {
    return (
        <div className="main-layout">
            <Header />
            <CategoriesBar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}
export default MainLayout