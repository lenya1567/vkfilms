import { createStore } from "effector";

export type FilmStore = {
    poster: string | null;
    name: string;
    description: string;
    rating: number;
    date: number;
    genres: string[];
} | null;

export const $film = createStore<FilmStore>(null);