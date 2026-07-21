"use strict";

/* =========================================
   GAME UNIVERSE
   Search, platform filters and shopping cart
========================================= */


/* =========================================
   SELECT HTML ELEMENTS
========================================= */

const cartButton = document.querySelector("#cart-button");
const cartPanel = document.querySelector("#cart-panel");
const cartOverlay = document.querySelector("#cart-overlay");
const closeCartButton = document.querySelector("#close-cart");

const cartItemsContainer = document.querySelector("#cart-items");
const cartCountElement = document.querySelector("#cart-count");
const cartTotalElement = document.querySelector("#cart-total");

const clearCartButton = document.querySelector("#clear-cart");
const checkoutButton = document.querySelector("#checkout-button");

const addToCartButtons = document.querySelectorAll(
    ".add-to-cart"
);

const gameCards = document.querySelectorAll(
    ".store-game-card"
);

const searchInput = document.querySelector(
    "#game-search"
);

const searchButton = document.querySelector(
    ".game-search button"
);

const filterButtons = document.querySelectorAll(
    ".game-filters button"
);

const mobileMenuCheckbox = document.querySelector(
    "#nav-box"
);

const navigationLinks = document.querySelectorAll(
    ".navbar a"
);


/* =========================================
   CART VARIABLES
========================================= */

const CART_STORAGE_KEY = "gameUniverseCart";

let cart = loadCart();

let activePlatform = "all";


/* =========================================
   LOCAL STORAGE
========================================= */

function loadCart() {
    try {
        const savedCart = localStorage.getItem(
            CART_STORAGE_KEY
        );

        if (!savedCart) {
            return [];
        }

        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart;
    } catch (error) {
        console.error("Could not load cart:", error);

        return [];
    }
}


function saveCart() {
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );
    } catch (error) {
        console.error("Could not save cart:", error);

        showToast(
            "The cart could not be saved.",
            "error"
        );
    }
}


/* =========================================
   OPEN AND CLOSE CART
========================================= */

function openCart() {
    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.add("cart-panel-open");

    cartOverlay.classList.add(
        "cart-overlay-visible"
    );

    document.body.classList.add("cart-open");

    cartPanel.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeCart() {
    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.remove("cart-panel-open");

    cartOverlay.classList.remove(
        "cart-overlay-visible"
    );

    document.body.classList.remove("cart-open");

    cartPanel.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================
   CREATE GAME INFORMATION
========================================= */

function getGameFromCard(gameCard) {
    if (!gameCard) {
        return null;
    }

    const name = gameCard.dataset.name;

    const price = Number(
        gameCard.dataset.price
    );

    const image = gameCard.dataset.image;

    const platform =
        gameCard.dataset.platform;

    if (
        !name ||
        !image ||
        !platform ||
        Number.isNaN(price)
    ) {
        console.error(
            "Invalid game information:",
            gameCard
        );

        return null;
    }

    return {
        id: createGameId(name),
        name: name,
        price: price,
        image: image,
        platform: platform,
        quantity: 1
    };
}


function createGameId(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}


/* =========================================
   ADD GAME TO CART
========================================= */

function addGameToCart(game) {
    const existingGame = cart.find(
        (cartGame) => {
            return cartGame.id === game.id;
        }
    );

    if (existingGame) {
        existingGame.quantity += 1;
    } else {
        cart.push(game);
    }

    saveCart();
    renderCart();

    showToast(
        `${game.name} added to your cart.`,
        "success"
    );
}


function handleAddToCart(button) {
    const gameCard = button.closest(
        ".store-game-card"
    );

    const game = getGameFromCard(gameCard);

    if (!game) {
        showToast(
            "This game could not be added.",
            "error"
        );

        return;
    }

    addGameToCart(game);

    const originalText =
        button.textContent.trim();

    button.textContent = "Added ✓";

    button.classList.add("game-added");

    button.disabled = true;

    window.setTimeout(() => {
        button.textContent = originalText;

        button.classList.remove(
            "game-added"
        );

        button.disabled = false;
    }, 1000);
}


/* =========================================
   REMOVE GAME
========================================= */

function removeGameFromCart(gameId) {
    const gameToRemove = cart.find(
        (game) => game.id === gameId
    );

    cart = cart.filter(
        (game) => game.id !== gameId
    );

    saveCart();
    renderCart();

    if (gameToRemove) {
        showToast(
            `${gameToRemove.name} removed.`,
            "info"
        );
    }
}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeGameQuantity(gameId, amount) {
    const game = cart.find(
        (cartGame) => {
            return cartGame.id === gameId;
        }
    );

    if (!game) {
        return;
    }

    game.quantity += amount;

    if (game.quantity <= 0) {
        removeGameFromCart(gameId);

        return;
    }

    saveCart();
    renderCart();
}


/* =========================================
   CALCULATE TOTAL
========================================= */

function calculateCartTotals() {
    return cart.reduce(
        (totals, game) => {
            totals.quantity += game.quantity;

            totals.price +=
                game.price * game.quantity;

            return totals;
        },
        {
            quantity: 0,
            price: 0
        }
    );
}


function formatPrice(price) {
    return new Intl.NumberFormat(
        "en-GB",
        {
            style: "currency",
            currency: "GBP"
        }
    ).format(price);
}


function formatPlatform(platform) {
    if (platform === "pc") {
        return "PC";
    }

    return platform
        .split("-")
        .map((word) => {
            return (
                word.charAt(0).toUpperCase() +
                word.slice(1)
            );
        })
        .join(" ");
}


/* =========================================
   DISPLAY CART
========================================= */

function renderCart() {
    const totals = calculateCartTotals();

    if (cartCountElement) {
        cartCountElement.textContent =
            totals.quantity;
    }

    if (cartTotalElement) {
        cartTotalElement.textContent =
            formatPrice(totals.price);
    }

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        renderEmptyCart();
        updateCheckoutButton();

        return;
    }

    cart.forEach((game) => {
        const cartItem =
            createCartItem(game);

        cartItemsContainer.appendChild(
            cartItem
        );
    });

    updateCheckoutButton();
}


function renderEmptyCart() {
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">

            <span aria-hidden="true">
                🎮
            </span>

            <h3>Your cart is empty</h3>

            <p>
                Add some games and begin
                your next adventure.
            </p>

            <button
                type="button"
                class="continue-shopping-button"
            >
                Continue Shopping
            </button>

        </div>
    `;

    const continueShoppingButton =
        cartItemsContainer.querySelector(
            ".continue-shopping-button"
        );

    if (continueShoppingButton) {
        continueShoppingButton.addEventListener(
            "click",
            closeCart
        );
    }
}


function createCartItem(game) {
    const cartItem =
        document.createElement("article");

    cartItem.className = "cart-item";

    cartItem.dataset.cartId = game.id;

    cartItem.innerHTML = `
        <img
            src="${escapeHTML(game.image)}"
            alt="${escapeHTML(game.name)}"
            class="cart-item-image"
        >

        <div class="cart-item-info">

            <h3>
                ${escapeHTML(game.name)}
            </h3>

            <p class="cart-item-platform">
                ${escapeHTML(
                    formatPlatform(game.platform)
                )}
            </p>

            <p class="cart-item-price">
                ${formatPrice(game.price)}
            </p>

            <div class="quantity-controls">

                <button
                    type="button"
                    class="decrease-quantity"
                    aria-label="Decrease quantity"
                >
                    −
                </button>

                <span>
                    ${game.quantity}
                </span>

                <button
                    type="button"
                    class="increase-quantity"
                    aria-label="Increase quantity"
                >
                    +
                </button>

            </div>

            <p class="cart-item-subtotal">
                Subtotal:

                <strong>
                    ${formatPrice(
                        game.price *
                        game.quantity
                    )}
                </strong>
            </p>

        </div>

        <button
            type="button"
            class="remove-cart-item"
            aria-label="Remove game"
        >
            &times;
        </button>
    `;

    const decreaseButton =
        cartItem.querySelector(
            ".decrease-quantity"
        );

    const increaseButton =
        cartItem.querySelector(
            ".increase-quantity"
        );

    const removeButton =
        cartItem.querySelector(
            ".remove-cart-item"
        );

    decreaseButton.addEventListener(
        "click",
        () => {
            changeGameQuantity(
                game.id,
                -1
            );
        }
    );

    increaseButton.addEventListener(
        "click",
        () => {
            changeGameQuantity(
                game.id,
                1
            );
        }
    );

    removeButton.addEventListener(
        "click",
        () => {
            removeGameFromCart(
                game.id
            );
        }
    );

    return cartItem;
}


function updateCheckoutButton() {
    if (!checkoutButton) {
        return;
    }

    checkoutButton.disabled =
        cart.length === 0;
}


/* =========================================
   CLEAR CART
========================================= */

function clearCart() {
    if (cart.length === 0) {
        showToast(
            "Your cart is already empty.",
            "info"
        );

        return;
    }

    const confirmed = window.confirm(
        "Remove every game from the cart?"
    );

    if (!confirmed) {
        return;
    }

    cart = [];

    saveCart();
    renderCart();

    showToast(
        "Your cart has been cleared.",
        "info"
    );
}


/* =========================================
   DEMONSTRATION CHECKOUT
========================================= */

function checkout() {
    if (cart.length === 0) {
        showToast(
            "Your cart is empty.",
            "error"
        );

        return;
    }

    const totals = calculateCartTotals();

    const confirmed = window.confirm(
        `Confirm ${totals.quantity} game(s) ` +
        `for ${formatPrice(totals.price)}?`
    );

    if (!confirmed) {
        return;
    }

    showOrderSuccess(totals);

    cart = [];

    saveCart();
    renderCart();
    closeCart();
}


function showOrderSuccess(totals) {
    const orderNumber =
        `GU-${Date.now()
            .toString()
            .slice(-8)}`;

    const successModal =
        document.createElement("div");

    successModal.className =
        "order-success-overlay";

    successModal.innerHTML = `
        <div
            class="order-success-modal"
            role="dialog"
            aria-modal="true"
        >

            <span class="success-icon">
                ✓
            </span>

            <h2>
                Purchase Successful
            </h2>

            <p>
                Thank you for buying from
                Game Universe.
            </p>

            <div class="order-summary">

                <p>
                    <span>Order number</span>

                    <strong>
                        ${orderNumber}
                    </strong>
                </p>

                <p>
                    <span>Games</span>

                    <strong>
                        ${totals.quantity}
                    </strong>
                </p>

                <p>
                    <span>Total</span>

                    <strong>
                        ${formatPrice(
                            totals.price
                        )}
                    </strong>
                </p>

            </div>

            <p class="demo-payment-message">
                This is a demonstration purchase.
                No real payment was taken.
            </p>

            <button
                type="button"
                class="close-success-modal"
            >
                Continue
            </button>

        </div>
    `;

    document.body.appendChild(
        successModal
    );

    document.body.classList.add(
        "cart-open"
    );

    const closeButton =
        successModal.querySelector(
            ".close-success-modal"
        );

    function removeModal() {
        successModal.remove();

        document.body.classList.remove(
            "cart-open"
        );
    }

    closeButton.addEventListener(
        "click",
        removeModal
    );

    successModal.addEventListener(
        "click",
        (event) => {
            if (
                event.target ===
                successModal
            ) {
                removeModal();
            }
        }
    );
}


/* =========================================
   SEARCH AND EXACT PLATFORM FILTERING
========================================= */

function filterGames() {
    if (gameCards.length === 0) {
        return;
    }

    const searchText = searchInput
        ? searchInput.value
            .trim()
            .toLowerCase()
        : "";

    let visibleGames = 0;

    gameCards.forEach((gameCard) => {
        const gameName =
            gameCard.dataset.name
                ?.trim()
                .toLowerCase() || "";

        const platform =
            gameCard.dataset.platform
                ?.trim()
                .toLowerCase() || "";

        const category =
            gameCard
                .querySelector(
                    ".game-category"
                )
                ?.textContent
                .trim()
                .toLowerCase() || "";

        const description =
            gameCard
                .querySelector(
                    ".game-description"
                )
                ?.textContent
                .trim()
                .toLowerCase() || "";

        /*
        Search matches the game name,
        category or description.
        */

        const matchesSearch =
            gameName.includes(searchText) ||
            category.includes(searchText) ||
            description.includes(searchText);

        /*
        Exact platform filtering:

        All          = every game
        PlayStation  = only playstation
        Xbox         = only xbox
        Nintendo     = only nintendo
        PC           = only pc

        Games marked multi-platform appear
        only when All is selected.
        */

        const matchesPlatform =
            activePlatform === "all" ||
            platform === activePlatform;

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
    });

    renderSearchMessage(
        visibleGames
    );
}


/* =========================================
   NO SEARCH RESULTS
========================================= */

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


/* =========================================
   TOAST NOTIFICATIONS
========================================= */

function showToast(
    message,
    type = "info"
) {
    let toastContainer =
        document.querySelector(
            "#toast-container"
        );

    if (!toastContainer) {
        toastContainer =
            document.createElement(
                "div"
            );

        toastContainer.id =
            "toast-container";

        toastContainer.className =
            "toast-container";

        document.body.appendChild(
            toastContainer
        );
    }

    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${type}`;

    toast.innerHTML = `
        <span class="toast-symbol">
            ${getToastIcon(type)}
        </span>

        <p>
            ${escapeHTML(message)}
        </p>

        <button
            type="button"
            aria-label="Close notification"
        >
            &times;
        </button>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add(
            "toast-visible"
        );
    });

    const closeButton =
        toast.querySelector("button");

    closeButton.addEventListener(
        "click",
        () => {
            removeToast(toast);
        }
    );

    window.setTimeout(() => {
        removeToast(toast);
    }, 3500);
}


function getToastIcon(type) {
    const icons = {
        success: "✓",
        error: "!",
        info: "i"
    };

    return icons[type] ||
        icons.info;
}


function removeToast(toast) {
    if (
        !toast ||
        !toast.isConnected
    ) {
        return;
    }

    toast.classList.remove(
        "toast-visible"
    );

    window.setTimeout(() => {
        toast.remove();
    }, 300);
}


/* =========================================
   PROTECT INSERTED TEXT
========================================= */

function escapeHTML(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   ADD-TO-CART EVENTS
========================================= */

addToCartButtons.forEach(
    (button) => {
        button.addEventListener(
            "click",
            () => {
                handleAddToCart(
                    button
                );
            }
        );
    }
);


/* =========================================
   FILTER BUTTON EVENTS
========================================= */

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


/* =========================================
   SEARCH EVENTS
========================================= */

if (searchInput) {
    /*
    Filter automatically while typing.
    */

    searchInput.addEventListener(
        "input",
        filterGames
    );

    /*
    Press Escape inside the search box
    to clear the search.
    */

    searchInput.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key === "Escape"
            ) {
                searchInput.value = "";

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


/* =========================================
   CART EVENTS
========================================= */

if (cartButton) {
    cartButton.addEventListener(
        "click",
        openCart
    );
}


if (closeCartButton) {
    closeCartButton.addEventListener(
        "click",
        closeCart
    );
}


if (cartOverlay) {
    cartOverlay.addEventListener(
        "click",
        closeCart
    );
}


if (clearCartButton) {
    clearCartButton.addEventListener(
        "click",
        clearCart
    );
}


if (checkoutButton) {
    checkoutButton.addEventListener(
        "click",
        checkout
    );
}


/* =========================================
   KEYBOARD EVENTS
========================================= */

document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {
            closeCart();
        }
    }
);


/* =========================================
   CLOSE MOBILE MENU
========================================= */

navigationLinks.forEach(
    (link) => {
        link.addEventListener(
            "click",
            () => {
                if (
                    mobileMenuCheckbox
                ) {
                    mobileMenuCheckbox
                        .checked = false;
                }
            }
        );
    }
);


/* =========================================
   START WEBSITE
========================================= */

renderCart();
filterGames();


/* =========================================
   CONTACT FORM
========================================= */

const contactForm = document.querySelector("#contact-form");

console.log("Contact JavaScript loaded");
console.log("Contact form:", contactForm);

if (contactForm) {

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const firstNameInput =
            document.querySelector("#first-name");

        const firstName =
            firstNameInput
                ? firstNameInput.value.trim()
                : "";

        showContactSuccess(firstName);

        contactForm.reset();

    });

}


function showContactSuccess(firstName) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "contact-success-overlay";

    const customerName =
        firstName
            ? `, ${escapeHTML(firstName)}`
            : "";

    overlay.innerHTML = `
        <div class="contact-success-modal">

            <span class="contact-success-icon">
                ✓
            </span>

            <h2>
                Message Sent
            </h2>

            <p>
                Thank you${customerName}.
                Your message has been received.
            </p>

            <p class="contact-demo-message">
                This is a demonstration form.
                No real email has been sent.
            </p>

            <button
                class="close-contact-success"
                type="button"
            >
                Continue
            </button>

        </div>
    `;

    document.body.appendChild(overlay);

    document.body.style.overflow = "hidden";

    const closeButton =
        overlay.querySelector(".close-contact-success");


    function closeModal() {

        if (!overlay.isConnected) {
            return;
        }

        overlay.remove();

        document.body.style.overflow = "";

        document.removeEventListener(
            "keydown",
            closeWithEscape
        );

    }


    function closeWithEscape(event) {

        if (event.key === "Escape") {
            closeModal();
        }

    }


    closeButton.addEventListener(
        "click",
        closeModal
    );

    overlay.addEventListener(
        "click",
        function (event) {

            if (event.target === overlay) {
                closeModal();
            }

        }
    );

    document.addEventListener(
        "keydown",
        closeWithEscape
    );

    closeButton.focus();

}