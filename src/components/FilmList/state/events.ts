import { createEvent, sample } from "effector";
import { fetchFilmsFx } from "./effects";
import { $filmsList, type FilmsStore } from "./stores";
import { submitFilters, type FiltersValue } from "@components/FiltersBar";

export interface FetchFilmsEvent {
    filters: FiltersValue,
}

export const fetchFilms = createEvent<FetchFilmsEvent>();

sample({
    source: $filmsList,
    clock: fetchFilms,
    target: fetchFilmsFx,
    fn: (store: FilmsStore, payload: FetchFilmsEvent) => ({
        store,
        payload,
    })
})

$filmsList.on(fetchFilmsFx.doneData, (state, payload) => ({
    films: [...state.films, ...payload.films],
    nextCursor: payload.nextCursor,
    filters: state.filters,
}));

export const resetFilms = createEvent();

$filmsList.on(resetFilms, () => {
    return {
        films: [],
        nextCursor: null,
        filters: null
    }
});

submitFilters.watch(() => {
    resetFilms();
});