import type { FilmPreview } from "@components/FilmList";
import { createStore } from "effector";

export type FavoritesFilms = FilmPreview[] | null;

export const $favoriteFilms = createStore<FavoritesFilms>(null);