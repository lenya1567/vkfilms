import { createStore } from "effector";

export type FiltersValue = {
    genres: string[];
    rating: [number, number],
    date: [Date, Date],
    filterVersion?: number,
}

export type GenreList = null | {
    label: string,
    value: string
}[];

export const $filters = createStore<FiltersValue>({
    genres: [],
    rating: [0.1, 10],
    date: [new Date(1990, 0), new Date()],
});

export const $filtersGenreList = createStore<GenreList>(null);