import { AspectRatio, Box, Caption, Card, ContentBadge, DisplayTitle, Flex, Image, SimpleGrid, Spinner } from "@vkontakte/vkui";
import { useUnit } from "effector-react";
import { useEffect, useRef } from "react";
import { $filmsList, type FilmPreview } from "./state/stores";
import { filmsLoading } from "./state/effects";
import styles from "./FilmList.module.css";

interface FilmsListProps {
    onNextFilms?: () => void;
    onFilmSelect?: (filmSelected: FilmPreview) => void;
    selectedFilms: [string, string],

    // Если уже есть готовые данные
    filmsList?: FilmPreview[];
}

export function FilmsList(props: FilmsListProps) {
    const films = useUnit($filmsList);
    const filmsLoadingStatus = useUnit(filmsLoading);
    const filmsContainerFinish = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (props.filmsList) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                props.onNextFilms?.();
            }
        }, { threshold: 0.1 });

        if (filmsContainerFinish.current) {
            observer.observe(filmsContainerFinish.current);
        }

        return () => {
            observer.disconnect();
        }
    }, [filmsContainerFinish, props.onNextFilms]);

    return <SimpleGrid padding="xl" columns={5} gap="m" flexGrow={1}>
        {(props.filmsList ?? films.films).map((film, index) =>
            <Card className={styles.relative} key={film.id + "_" + index} mode="shadow" onClick={() => props.onFilmSelect?.(film)}>
                <Box className={styles.grow} position="relative">
                    <AspectRatio ratio={2 / 3}>
                        <Image objectFit="contain" widthSize="100%" heightSize="100%" src={film.poster ?? "/public/poster.png"} />
                    </AspectRatio>
                    <Flex align="center">
                        <Flex direction="column" padding="m" gap="s" flexGrow={1}>
                            <DisplayTitle className={styles.name} level="1" weight="3" inline>{film.name}</DisplayTitle>
                            <Caption>{film.year}</Caption>
                        </Flex>
                    </Flex>
                    <Box position="absolute" insetInlineStart="m" insetBlockStart="m">
                        <ContentBadge size="l">{film.rating.toPrecision(3)}</ContentBadge>
                    </Box>
                    {props.selectedFilms?.includes(film.id) && <Box className={styles.shadow} position="absolute" insetInline={0} insetBlock={0}>
                        {props.selectedFilms?.[0] === film.id
                            ? "1"
                            : (props.selectedFilms?.[1] === film.id && "2")
                        }
                    </Box>}
                </Box>
            </Card>
        )}
        <Box getRootRef={filmsContainerFinish} colSpan={4}>
            {filmsLoadingStatus && <Card mode="outline-tint">
                <AspectRatio ratio={2 / 3}>
                    {filmsLoadingStatus && <Spinner size="xl" />}
                </AspectRatio>
            </Card>}
        </Box>
    </SimpleGrid>
}

/**navigate("/film/" + film.id) */