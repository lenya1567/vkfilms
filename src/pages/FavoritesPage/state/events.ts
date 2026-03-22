import { createEvent, sample } from "effector";
import { $favoriteFilms, type FavoritesFilms } from "./stores";
import { fetchFavoriteFilmsFx, saveFavoriteFilmFx } from "./effects";
import type { FilmPreview } from "@components/FilmList";

export const fetchFavoriteFilms = createEvent();
$favoriteFilms.on(fetchFavoriteFilmsFx.doneData, (_, payload) => {
    return payload;
});

sample({
    source: $favoriteFilms,
    clock: fetchFavoriteFilms,
    target: fetchFavoriteFilmsFx,
})

export const saveFavoriteFilm = createEvent<FilmPreview>();
$favoriteFilms.on(saveFavoriteFilmFx.doneData, (_, payload) => {
    return payload;
});

sample({
    source: $favoriteFilms,
    clock: saveFavoriteFilm,
    target: saveFavoriteFilmFx,
    fn: (store: FavoritesFilms, payload: FilmPreview) => ({
        store, payload
    })
})

