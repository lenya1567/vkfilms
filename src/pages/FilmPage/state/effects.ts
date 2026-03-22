import { createEffect } from "effector";
import { serverApi } from "../../../api";

export const fetchFilmDataFx = createEffect(async ({ payload }: { payload: { id: number } }) => {
    const data = await serverApi.get('v1.4/movie/' + payload.id);
    return data.data;
});

export const isFilmLoading = fetchFilmDataFx.pending;