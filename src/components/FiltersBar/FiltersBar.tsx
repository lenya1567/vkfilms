import { Box, Button, ButtonGroup, ChipsSelect, DateRangeInput, DisplayTitle, FixedLayout, Flex, FormItem, FormLayoutGroup, Separator, Slider, Spacing } from "@vkontakte/vkui";
import styles from "./FiltersBar.module.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUnit } from "effector-react";
import { $filters, $filtersGenreList} from "./state/stores";
import { fetchGenres, submitFilters, updateFilters } from "./state/events";
import { useNavigate, useSearchParams } from "react-router";

interface FiltersBarProps {
    onCompareFilms: () => void;
    onSubmitFilters: () => void;
}

export function FiltersBar(props: FiltersBarProps) {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const genreList = useUnit($filtersGenreList);
    const fetchGenreFn = useUnit(fetchGenres);

    const filtersValue = useUnit($filters);
    const updateFiltersFn = useUnit(updateFilters);
    const sumbitFiltersFn = useUnit(submitFilters);

    const formRef = useRef<HTMLDivElement>(null);
    const [spacingSize, setSpacingSize] = useState<number>(84);

    const updateQuery = useCallback((reset = false) => {
        if (reset) {
            setSearchParams({});
            return;
        }
        const newSearchParams = searchParams;
        newSearchParams.set("genre", filtersValue.genres.join(","));
        newSearchParams.set("rating", filtersValue.rating.join("_"));
        newSearchParams.set("date", filtersValue.date.map((date) => date.toLocaleDateString()).join(","));
        setSearchParams(newSearchParams);
    }, [searchParams, setSearchParams, filtersValue]);

    const getFromQuery = useCallback(() => {
        const genres = searchParams.get("genre")?.split(",") ?? [];
        const rating = searchParams.get("rating")?.split("_").map((v) => parseFloat(v)) as [number, number];
        const date = searchParams.get("date")?.split(",").map((v) => {
            const values = v.split("/").map((v) => parseInt(v));
            return new Date(values[2], values[1], values[0]);
        }) as [Date, Date];

        if (genres !== undefined && rating !== undefined && date !== undefined) {
            updateFiltersFn({ genres, rating, date, filterVersion: 1 });
        }
    }, [searchParams, updateFiltersFn]);

    const onSubmitFilters = useCallback(() => {
        updateQuery();
        sumbitFiltersFn({ reset: false });
        props.onSubmitFilters();
    }, [updateQuery, sumbitFiltersFn, filtersValue]);

    const onResetFilters = useCallback(() => {
        updateQuery(true);
        sumbitFiltersFn({ reset: true });
        props.onSubmitFilters();
    }, [updateQuery, sumbitFiltersFn, filtersValue]);

    const updateGenre = useCallback((newValue: { label: string }[]) => {
        setTimeout(() => updateFiltersFn({ genres: newValue.map((option) => option.label) }), 0);
    }, [updateFiltersFn]);

    const updateRating = useCallback((newValue: [number, number]) => {
        updateFiltersFn({ rating: newValue })
    }, [updateFiltersFn]);

    const updateDate = useCallback((newValue?: [Date | null, Date | null]) => {
        if (newValue && newValue[0] !== null && newValue[1] !== null) {
            updateFiltersFn({ date: newValue as [Date, Date] })
        }
    }, []);

    useEffect(() => {
        if (!genreList) {
            fetchGenreFn();
        }
        getFromQuery();
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            console.log(entry.contentRect.height);
            setSpacingSize(entry.contentRect.height);
        });

        if (formRef.current) {
            observer.observe(formRef.current);
        }

        return () => observer.disconnect();
    }, [formRef, setSpacingSize]);

    const genresChipsValue = useMemo(() => {
        return genreList?.filter((genre) => filtersValue.genres.includes(genre.label));
    }, [genreList, filtersValue]);

    return <>
        <FixedLayout className={styles.filters} getRootRef={formRef} useParentWidth>
            <Box padding="2xl">
                <Flex align="center" gap="2xl">
                    <DisplayTitle>Фильмы и сериалы</DisplayTitle>
                    <ButtonGroup>
                        <Button size="l" mode="tertiary" onClick={() => navigate("/favorites")}>Избранное</Button>
                        <Button size="l" mode="tertiary" onClick={() => props.onCompareFilms?.()} >Сравнить фильмы</Button>
                    </ButtonGroup>
                </Flex>
            </Box>
            <Separator />
            <FormLayoutGroup className={styles.grow} key={"filters_" + filtersValue.filterVersion} mode="horizontal">
                <FormItem htmlFor="name" top="Жанр:" key={"genres_" + genresChipsValue?.length}>
                    <ChipsSelect
                        id="name"
                        defaultValue={genresChipsValue}
                        options={genreList ?? []}
                        onChange={updateGenre}
                        placeholder="Выберите значение"
                    />
                </FormItem>
                <FormItem htmlFor="rate" top="Рейтинг">
                    <Flex direction="column" justify="center" minBlockSize="36px">
                        <Slider
                            id="rate"
                            defaultValue={[filtersValue.rating[0], filtersValue.rating[1]]}
                            min={0.1}
                            max={10}
                            step={0.1}
                            withTooltip
                            multiple
                            onChange={updateRating}
                        />
                    </Flex>
                </FormItem>
                <FormItem htmlFor="date" top="Год выпуска:" size={200}>
                    <DateRangeInput
                        id="date"
                        onChange={updateDate}
                        defaultValue={filtersValue.date}
                    />
                </FormItem>
                <Flex paddingInlineStart="2xl" gap="l">
                    <Button mode="outline" size="l" onClick={onResetFilters}>Сбросить</Button>
                    <Button appearance="accent" size="l" onClick={onSubmitFilters}>Применить</Button>
                </Flex>
            </FormLayoutGroup>
        </FixedLayout>
        <Spacing size={spacingSize} />
    </>
}