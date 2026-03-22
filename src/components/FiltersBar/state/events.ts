import { createEvent, sample } from "effector";
import { fetchGenresFx } from "./effects";
import { $filters, $filtersGenreList, type FiltersValue } from "./stores";

export const fetchGenres = createEvent();
$filtersGenreList.on(fetchGenresFx.doneData, (_, payload) => {
    return payload.map((value: any) => ({
        label: value.name,
        value: value.slug,
    }))
});

sample({
    clock: fetchGenres,
    source: $filtersGenreList,
    target: fetchGenresFx,
});

export const updateFilters = createEvent<Partial<FiltersValue>>();
$filters.on(updateFilters, (state, payload) => {
    return {
        ...state,
        ...payload,
    }
});

export const submitFilters = createEvent<{ reset: boolean }>();
$filters.on(submitFilters, (state, payload) => {
    console.log(state);
    if (payload.reset) {
        return {
            genres: [],
            rating: [0.1, 10],
            date: [new Date(1990, 0), new Date()],
            filterVersion: 0,
        }
    } else {
        return {
            ...state,
            filterVersion: (state.filterVersion ?? 0) + 1,
        };
    }
});