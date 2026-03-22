import { createEffect } from "effector";
import type { FilmsStore } from "./stores";
import type { FetchFilmsEvent } from "./events";
import { serverApi } from "@api";

export const fetchFilmsFx = createEffect(async ({ store, payload }: { store: FilmsStore, payload: FetchFilmsEvent }) => {
    const filters = store.filters ? store.filters : payload.filters;

    if (store.nextCursor === null && store.films.length !== 0) {
        return {
            films: [],
            filters,
            nextCursor: null
        };
    }

    const queryParams = [
        ...filters.genres.filter(e => e).map((genre) => ({ key: "genres.name", value: genre })),
        { key: "rating.kp", value: filters.rating.join("-") },
        { key: "year", value: filters.date.map((v) => v.getFullYear()).join("-") },
        { key: "limit", value: "50" },
        { key: "notNullFields", value: "name" },
        ...(store.nextCursor ? [{ key: "next", value: store.nextCursor }] : [])
    ];

    const response = await serverApi.get(
        `v1.5/movie?`
        + queryParams.map((param) => `${param.key}=${encodeURIComponent(param.value)}`).join("&")
    );

    const films = response.data.docs.map((film: any) => ({
        id: film.id,
        name: film.name,
        year: film.year,
        rating: film.rating.kp,
        poster: film.poster?.previewUrl ?? null,
        duration: film.movieLength,
        genres: film.genres.map((e: { name: string }) => e.name),
    }));
    const nextCursor = response.data.hasNext ? response.data.next : null;

    return {
        films,
        filters: filters,
        nextCursor: nextCursor,
    };
});

export const filmsLoading = fetchFilmsFx.pending;