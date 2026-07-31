"use strict";


let activePlatform = "all";

let gameCards;
let searchInput;
let searchButton;
let filterButtons;


export function initGameFilters() {
    gameCards =
        document.querySelectorAll(
            ".store-game-card"
        );

    searchInput =
        document.querySelector(
            "#game-search"
        );

    searchButton =
        document.querySelector(
            ".game-search button"
        );

    filterButtons =
        document.querySelectorAll(
            ".game-filters button"
        );

    filterButtons.forEach(
        (button) => {
            button.addEventListener(
                "click",
                () => {
                    activePlatform =
                        button.dataset.filter ||
                        "all";

                    filterButtons.forEach(
                        (filterButton) => {
                            filterButton
                                .classList
                                .remove(
                                    "filter-active"
                                );
                        }
                    );

                    button.classList.add(
                        "filter-active"
                    );

                    filterGames();
                }
            );
        }
    );

    if (searchInput) {
        searchInput.addEventListener(
            "input",
            filterGames
        );

        searchInput.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key ===
                    "Escape"
                ) {
                    searchInput.value =
                        "";

                    filterGames();
                }
            }
        );
    }

    if (searchButton) {
        searchButton.addEventListener(
            "click",
            filterGames
        );
    }

    filterGames();
}


function filterGames() {
    if (
        !gameCards ||
        gameCards.length === 0
    ) {
        return;
    }

    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    let visibleGames = 0;

    gameCards.forEach(
        (gameCard) => {
            const gameName =
                gameCard.dataset.name
                    ?.trim()
                    .toLowerCase() ||
                "";

            const platform =
                gameCard.dataset.platform
                    ?.trim()
                    .toLowerCase() ||
                "";

            const category =
                gameCard
                    .querySelector(
                        ".game-category"
                    )
                    ?.textContent
                    .trim()
                    .toLowerCase() ||
                "";

            const description =
                gameCard
                    .querySelector(
                        ".game-description"
                    )
                    ?.textContent
                    .trim()
                    .toLowerCase() ||
                "";

            const matchesSearch =
                gameName.includes(
                    searchText
                ) ||
                category.includes(
                    searchText
                ) ||
                description.includes(
                    searchText
                );

            const matchesPlatform =
                activePlatform === "all" ||
                platform ===
                    activePlatform;

            const shouldDisplay =
                matchesSearch &&
                matchesPlatform;

            gameCard.classList.toggle(
                "game-hidden",
                !shouldDisplay
            );

            if (shouldDisplay) {
                visibleGames += 1;
            }
        }
    );

    renderSearchMessage(
        visibleGames
    );
}


function renderSearchMessage(
    visibleGames
) {
    const gamesGrid =
        document.querySelector(
            ".games-grid"
        );

    if (!gamesGrid) {
        return;
    }

    let message =
        document.querySelector(
            "#no-games-message"
        );

    if (visibleGames === 0) {
        if (!message) {
            message =
                document.createElement(
                    "div"
                );

            message.id =
                "no-games-message";

            message.className =
                "no-games-message";

            message.innerHTML = `
                <span aria-hidden="true">
                    🔍
                </span>

                <h3>
                    No games found
                </h3>

                <p>
                    Try another game name
                    or select another platform.
                </p>

                <button
                    type="button"
                    id="reset-game-search"
                >
                    Show All Games
                </button>
            `;

            gamesGrid.appendChild(
                message
            );

            const resetButton =
                message.querySelector(
                    "#reset-game-search"
                );

            resetButton.addEventListener(
                "click",
                resetGameSearch
            );
        }

    } else if (message) {
        message.remove();
    }
}


function resetGameSearch() {
    activePlatform = "all";

    if (searchInput) {
        searchInput.value = "";
    }

    filterButtons.forEach(
        (button) => {
            const isAllButton =
                button.dataset.filter ===
                "all";

            button.classList.toggle(
                "filter-active",
                isAllButton
            );
        }
    );

    filterGames();
}