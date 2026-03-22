import type { FiltersValue } from "@components/FiltersBar";
import { createStore } from "effector";

export interface FilmPreview {
    id: string;
    name: string;
    rating: number;
    year: number;
    poster: string | null;
    duration?: number;
}

export interface FilmsStore {
    nextCursor: string | null;
    filters: FiltersValue | null,
    films: FilmPreview[];
}

export const $filmsList = createStore<FilmsStore>({
    films: [],
    filters: null,
    nextCursor: null,
});