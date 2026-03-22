import { BrowserRouter, Route, Routes } from "react-router";
import { MainPage } from "@pages/MainPage";
import { FilmPage } from "@pages/FilmPage";
import "./app.css";
import { FavoritesPage } from "@pages/FavoritesPage";

export function App() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/film/:id" element={<FilmPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
    </BrowserRouter>
}