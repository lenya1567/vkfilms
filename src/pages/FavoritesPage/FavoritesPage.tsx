import { Box, Button, DisplayTitle, FixedLayout, Flex, Spacing } from "@vkontakte/vkui";
import { FilmsList } from "@components/FilmList";
import { useUnit } from "effector-react";
import { fetchFavoriteFilms } from "./state/events";
import { useEffect } from "react";
import { $favoriteFilms } from "./state/stores";
import styles from "./FavoritesPage.module.css";
import { useNavigate } from "react-router";

export function FavoritesPage() {
    const navigate = useNavigate();
    const favoriteFilms = useUnit($favoriteFilms);
    const fetchFavoriteFilmsFn = useUnit(fetchFavoriteFilms);

    useEffect(() => {
        if (favoriteFilms === null) {
            fetchFavoriteFilmsFn();
        }
    }, []);

    return <Flex direction="column">
        <FixedLayout className={styles.filters} useParentWidth>
            <Box padding="2xl">
                <Flex justify="space-between" align="center">
                    <DisplayTitle>Избранное</DisplayTitle>
                    <Button size="l" mode="tertiary" onClick={() => navigate("/")}>Вернуться на главную страницу</Button>
                </Flex>
            </Box>
        </FixedLayout>
        <Spacing size={68} />
        <FilmsList filmsList={favoriteFilms ?? []} onFilmSelect={(film) => navigate("/film/" + film.id)} selectedFilms={["", ""]} />
    </Flex>
}