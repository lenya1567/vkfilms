import { Box, Button, Caption, Card, ContentBadge, Flex, Headline, InfoRow, SimpleCell, SimpleGrid, Title } from "@vkontakte/vkui";
import { $filters, FiltersBar } from "@components/FiltersBar";
import { fetchFilms, type FilmPreview, FilmsList } from "@components/FilmList";
import { useCallback, useMemo, useState } from "react";
import { useUnit } from "effector-react";
import styles from "./MainPage.module.css";
import { useNavigate } from "react-router";

export function MainPage() {
    const navigate = useNavigate();

    const filtersValue = useUnit($filters);
    const fetchFilmsFn = useUnit(fetchFilms);

    const [selectedFilms, setSelectedFilms] = useState<(FilmPreview | null)[]>([null, null]);
    const [selectIndex, setSelectIndex] = useState(0);
    const [compareTableOpened, setCompareTableOpened] = useState(false);

    const onNextFilmsFn = useCallback(() => {
        fetchFilmsFn({ filters: filtersValue! });
    }, [fetchFilmsFn, filtersValue.filterVersion]);

    const onSelectFilm = useCallback((selectedFilm: FilmPreview) => {
        if (!compareTableOpened) {
            navigate("/film/" + selectedFilm.id);
            return;
        }
        setSelectedFilms(prev => {
            return selectIndex === 0 ? [selectedFilm, prev[1]] : [prev[0], selectedFilm];
        });
        setSelectIndex(prev => (prev + 1) % 2);
    }, [setSelectedFilms, selectIndex, compareTableOpened]);

    const handleOpenCompareTable = useCallback(() => {
        setCompareTableOpened(true);
    }, [setCompareTableOpened]);

    const handleClear = useCallback(() => {
        setSelectedFilms([null, null]);
        setSelectIndex(0);
    }, [setSelectedFilms, setSelectIndex]);

    const handleCloseCompareTable = useCallback(() => {
        setCompareTableOpened(false);
        setSelectedFilms([null, null]);
        setSelectIndex(0);
    }, [setCompareTableOpened, setSelectedFilms, setSelectIndex]);

    const selectedFilmsId = useMemo(() => [selectedFilms[0]?.id ?? "", selectedFilms[1]?.id ?? ""], [selectedFilms]);

    return <Flex direction="column">
        <FiltersBar
            onCompareFilms={handleOpenCompareTable}
            onSubmitFilters={handleClear}
        />
        <FilmsList
            onNextFilms={onNextFilmsFn}
            onFilmSelect={onSelectFilm}
            selectedFilms={selectedFilmsId as [string, string]}
        />
        { compareTableOpened && <Box position="fixed" insetBlockEnd="2xl" insetInlineEnd="2xl">
            <Card mode="shadow">
                <Box className={styles.compareWindow}>
                    <Flex padding="2xl" gap="m">
                        <Title>Сравнительная таблица</Title>
                        <Caption>Выберите {selectIndex === 0 ? "первый" : "второй"} фильм</Caption>
                    </Flex>
                    <SimpleGrid columns={2} align="start">
                        {/* Название фильма */}

                        <SimpleCell multiline>
                            <Headline>
                                {selectedFilms[0]?.name ?? "-"}
                            </Headline>
                        </SimpleCell>

                        <SimpleCell multiline>
                            <Headline>
                                {selectedFilms[1]?.name ?? "-"}
                            </Headline>
                        </SimpleCell>

                        {/* Год выпуска */}

                        <SimpleCell multiline>
                            <InfoRow header="Год выпуска:">
                                {selectedFilms[0]?.year ?? "-"}
                            </InfoRow>
                        </SimpleCell>

                        <SimpleCell>
                            <InfoRow header="Год выпуска:">
                                {selectedFilms[1]?.year ?? "-"}
                            </InfoRow>
                        </SimpleCell>

                        {/* Рейтинг */}

                        <SimpleCell>
                            <InfoRow header="Рейтинг:">
                                {selectedFilms[0]?.rating.toPrecision(3) ?? "-"}
                            </InfoRow>
                        </SimpleCell>

                        <SimpleCell>
                            <InfoRow header="Рейтинг:">
                                {selectedFilms[1]?.rating.toPrecision(3) ?? "-"}
                            </InfoRow>
                        </SimpleCell>

                        {/* Жанры */}

                        <SimpleCell>
                            <InfoRow header="Жанры:">
                                <Flex gap="s" paddingBlockStart="2xs">
                                    {selectedFilms[0]?.genres?.map((genre) =>
                                        <ContentBadge key={"genre_" + genre}>{genre}</ContentBadge>
                                    )}
                                </Flex>
                            </InfoRow>
                        </SimpleCell>

                        <SimpleCell>
                            <InfoRow header="Жанры:">
                                <Flex gap="s" paddingBlockStart="2xs">
                                    {selectedFilms[1]?.genres?.map((genre) =>
                                        <ContentBadge key={"genre_" + genre}>{genre}</ContentBadge>
                                    )}
                                </Flex>
                            </InfoRow>
                        </SimpleCell>

                        {/* Длительность */}

                        <SimpleCell>
                            <InfoRow header="Длительность:">
                                {selectedFilms[0]?.duration ? selectedFilms[0]?.duration + " мин" : "-"}
                            </InfoRow>
                        </SimpleCell>

                        <SimpleCell>
                            <InfoRow header="Длительность:">
                                {selectedFilms[1]?.duration ? selectedFilms[1]?.duration + " мин" : "-"}
                            </InfoRow>
                        </SimpleCell>
                    </SimpleGrid>
                    <Flex justify="end" padding="2xl">
                        <Button size="l" mode="primary" onClick={handleCloseCompareTable}>
                            Закрыть
                        </Button>
                    </Flex>
                </Box>
            </Card>
        </Box> }
    </Flex>
}