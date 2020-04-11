import * as React from "react";
import styled from "styled-components";

import { Button, MenuItem } from "@blueprintjs/core";
import { ItemRenderer, MultiSelect } from "@blueprintjs/select";
import {
    arrayContainsFilm,
    filmSelectProps,
    IFilm,
    maybeAddCreatedFilmToArrays,
    maybeDeleteCreatedFilmFromArrays,
    TOP_100_FILMS,
} from './flims';

const Wrapper = styled.div`
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    width: 50%;
    .bp3-popover-wrapper{
        .bp3-popover-target{
            display: block;
            .bp3-tag-input{
                padding: 7px 10px;
                .bp3-tag{
                    background-color: palevioletred;
                    padding: 7px;
                    font-weight: bold;
                }
            }
        }
    }
`;

const FilmMultiSelect = MultiSelect.ofType<IFilm>();

export interface BluePrintMultiSelectState {
    createdItems: IFilm[];
    films: IFilm[];
    hasInitialContent: boolean;
    items: IFilm[];
    popoverMinimal: boolean;
    resetOnSelect: boolean;
}

export class BluePrintMultiSelect extends React.PureComponent<{}, BluePrintMultiSelectState> {

    public state: BluePrintMultiSelectState = {
        createdItems: [],
        films: [],
        hasInitialContent: false,
        items: filmSelectProps.items,
        popoverMinimal: true,
        resetOnSelect: false,
    };

    public render() {
        const { films, hasInitialContent, popoverMinimal } = this.state;

        const initialContent = hasInitialContent ? (
            <MenuItem disabled={true} text={`${TOP_100_FILMS.length} items loaded.`} />
        ) : (
                undefined
            );

        const clearButton =
            films.length > 0 ? <Button icon="cross" minimal={true} onClick={this.handleClear} /> : undefined;

        return (
            <Wrapper>
                <h1>React - Blueprint.js MultiSelect</h1>
                <FilmMultiSelect
                    {...filmSelectProps}
                    initialContent={initialContent}
                    itemRenderer={this.renderFilm}
                    items={this.state.items}
                    noResults={<MenuItem disabled={true} text="No results." />}
                    onItemSelect={this.handleFilmSelect}
                    popoverProps={{ minimal: popoverMinimal }}
                    tagRenderer={this.renderTag}
                    tagInputProps={{ onRemove: this.handleTagRemove, rightElement: clearButton }}
                    selectedItems={this.state.films}
                />
            </Wrapper>
        );
    }

    private renderTag = (film: IFilm) => film.title;

    private renderFilm: ItemRenderer<IFilm> = (film, { modifiers, handleClick }) => {
        if (!modifiers.matchesPredicate) {
            return null;
        }
        return (
            <MenuItem
                active={modifiers.active}
                icon={this.isFilmSelected(film) ? "tick" : "blank"}
                key={film.rank}
                label={film.year.toString()}
                onClick={handleClick}
                text={`${film.rank}. ${film.title}`}
                shouldDismissPopover={true}
            />
        );
    };

    private handleTagRemove = (_tag: string, index: number) => {
        this.deselectFilm(index);
    };

    private getSelectedFilmIndex(film: IFilm) {
        return this.state.films.indexOf(film);
    }

    private isFilmSelected(film: IFilm) {
        return this.getSelectedFilmIndex(film) !== -1;
    }

    private selectFilm(film: IFilm) {
        this.selectFilms([film]);
    }

    private selectFilms(filmsToSelect: IFilm[]) {
        const { createdItems, films, items } = this.state;

        let nextCreatedItems = createdItems.slice();
        let nextFilms = films.slice();
        let nextItems = items.slice();

        filmsToSelect.forEach(film => {
            const results = maybeAddCreatedFilmToArrays(nextItems, nextCreatedItems, film);
            nextItems = results.items;
            nextCreatedItems = results.createdItems;
            nextFilms = !arrayContainsFilm(nextFilms, film) ? [...nextFilms, film] : nextFilms;
        });

        this.setState({
            createdItems: nextCreatedItems,
            films: nextFilms,
            items: nextItems,
        });
    }

    private deselectFilm(index: number) {
        const { films } = this.state;

        const film = films[index];
        const { createdItems: nextCreatedItems, items: nextItems } = maybeDeleteCreatedFilmFromArrays(
            this.state.items,
            this.state.createdItems,
            film,
        );

        this.setState({
            createdItems: nextCreatedItems,
            films: films.filter((_film, i) => i !== index),
            items: nextItems,
        });
    }

    private handleFilmSelect = (film: IFilm) => {
        if (!this.isFilmSelected(film)) {
            this.selectFilm(film);
        } else {
            this.deselectFilm(this.getSelectedFilmIndex(film));
        }
    };

    private handleClear = () => this.setState({ films: [] });
}