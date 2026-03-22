import { Box, Button, ButtonGroup, ContentBadge, Flex, Group, Header, Image, InfoRow, ModalCard, SimpleCell, Spacing, Spinner, SplitCol } from "@vkontakte/vkui";
import styles from "./FilmPage.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUnit } from "effector-react";
import { $film } from "./state/stores";
import { fetchFilmData } from "./state/events";
import { isFilmLoading } from "./state/effects";
import { Icon56Stars3Outline } from "@vkontakte/icons";
import { useNavigate, useParams } from "react-router";
import { saveFavoriteFilm } from "@pages/FavoritesPage";
import { fetchFavoriteFilmsFx } from "@pages/FavoritesPage/state/effects";
import { $favoriteFilms } from "@pages/FavoritesPage/state/stores";

export function FilmPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchFilmFn = useUnit(fetchFilmData);
    const isFilmLoadingData = useUnit(isFilmLoading);
    const filmData = useUnit($film);

    const fetchFavoriteFilmsFn = useUnit(fetchFavoriteFilmsFx);
    const saveFavoriteFilmFn = useUnit(saveFavoriteFilm);
    const favoriteFilms = useUnit($favoriteFilms);

    const [openLinkModal, setOpenLikeModal] = useState(false);

    const handleSaveFavoriteFilm = useCallback(() => {
        saveFavoriteFilmFn({
            id: id!,
            name: filmData?.name!,
            rating: filmData?.rating!,
            poster: filmData?.poster!,
            year: filmData?.date!,
        });
        setOpenLikeModal(false);
    }, [setOpenLikeModal, filmData]);

    useEffect(() => {
        console.log(id)
        fetchFilmFn({ id: parseInt(id!) });
    }, [fetchFilmFn, id]);

    useEffect(() => {
        if (favoriteFilms === null) {
            fetchFavoriteFilmsFn();
        }
    }, [fetchFavoriteFilmsFn]);

    console.log(favoriteFilms, id)

    const filmInFavorite = useMemo(
        () => (favoriteFilms ?? []).find(film => film.id === id) !== undefined,
        [favoriteFilms, id]
    );

    return <Flex className={styles.fullPage} align="center" justify="center">
        <Box position="fixed" insetInlineStart="xl" insetBlockStart="xl">
            <Button mode="tertiary" onClick={() => navigate("/")}>Вернуться на главную страницу</Button>
        </Box>
        {isFilmLoadingData ? <Spinner size="l" /> :
            <Flex className={styles.card} direction="row" flexGrow={1} padding="4xl" gap="2xl">
                <Image className={styles.poster} objectFit="contain" widthSize="50%" heightSize="100%" src={filmData?.poster ?? "/public/poster.png"} />
                <SplitCol className={styles.col}>
                    <Group className={styles.grow} header={<Header>{filmData?.name}</Header>}>
                        <SimpleCell multiline>
                            <InfoRow header="Описание фильма:" >{filmData?.description}</InfoRow>
                        </SimpleCell>

                        <SimpleCell>
                            <InfoRow header="Рейтинг:">{filmData?.rating.toPrecision(3)}</InfoRow>
                        </SimpleCell>

                        <SimpleCell>
                            <InfoRow header="Дата выхода:">{filmData?.date}</InfoRow>
                        </SimpleCell>

                        <SimpleCell>
                            <InfoRow header="Жанры:">
                                <Flex gap="s" paddingBlockStart="2xs">
                                    {filmData?.genres.map((genre) =>
                                        <ContentBadge key={"genre_" + genre}>{genre}</ContentBadge>
                                    )}
                                </Flex>
                            </InfoRow>
                        </SimpleCell>
                    </Group>
                    <Flex justify="end">
                        <Button disabled={filmInFavorite} size="l" onClick={() => setOpenLikeModal(true)}>
                            {
                                filmInFavorite ? "В избранном" : "Добавить в избранное"
                            }
                        </Button>
                    </Flex>
                </SplitCol>
            </Flex>
        }
        <ModalCard
            open={openLinkModal}
            onClose={() => setOpenLikeModal(false)}
            icon={<Icon56Stars3Outline />}
            title={'Добавить данный фильм в раздел "Избранное"?'}
            actions={
                <>
                    <Spacing size={16} />
                    <ButtonGroup gap="m" stretched>
                        <Button key="deny" size="l" mode="secondary" stretched onClick={() => setOpenLikeModal(false)}>
                            Отмена
                        </Button>
                        <Button key="allow" size="l" mode="primary" stretched onClick={handleSaveFavoriteFilm}>
                            Добавить
                        </Button>
                    </ButtonGroup>
                </>
            }
        />
    </Flex>
}