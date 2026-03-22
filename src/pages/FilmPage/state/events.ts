import { createEvent, sample } from "effector";
import { $film } from "./stores";
import { fetchFilmDataFx } from "./effects";

export const fetchFilmData = createEvent<{ id: number }>();
$film.on(fetchFilmDataFx.doneData, (_, payload) => {
    let dateString = payload.year;
    if (payload.premier?.world) {
        const date = new Date(payload.premier?.world);
        dateString = date.toLocaleDateString();
    }

    return {
        name: payload.name,
        description: payload.description,
        date: dateString,
        genres: payload.genres.map((genre: { name: string }) => genre.name),
        rating: payload.rating.kp,
        poster: payload.poster?.url,
    };
});

sample({
    source: $film,
    clock: fetchFilmData,
    target: fetchFilmDataFx,
    fn: (_, payload: { id: number }) => ({
        payload
    })
})