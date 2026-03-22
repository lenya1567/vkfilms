import { createEffect } from "effector";
import type { FavoritesFilms } from "./stores";
import type { FilmPreview } from "@components/FilmList";

export const fetchFavoriteFilmsFx = createEffect(() => {
    const films = localStorage.getItem("films");
    return JSON.parse(films ?? "[]");
});

export const saveFavoriteFilmFx = createEffect(({ store, payload }: { store: FavoritesFilms, payload: FilmPreview }) => {
    const newFilms = [...store ?? [], payload];
    localStorage.setItem("films", JSON.stringify(newFilms));
    return newFilms;
});