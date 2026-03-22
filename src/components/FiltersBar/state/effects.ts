import { createEffect } from "effector";
import { serverApi } from "../../../api";

export const fetchGenresFx = createEffect(async () => {
    const data = await serverApi.get('v1/movie/possible-values-by-field?field=genres.name');
    return data.data;
});