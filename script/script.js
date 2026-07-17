"use strict";

/* =========================================
   GAME UNIVERSE
   Search, filters and shopping cart
========================================= */


/* =========================================
   ELEMENTS
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

const addToCartButtons =
    document.querySelectorAll(".add-to-cart");

const gameCards =
    document.querySelectorAll(".store-game-card");

const searchInput =
    document.querySelector("#game-search");

const searchButton =
    document.querySelector(".game-search button");

const filterButtons =
    document.querySelectorAll(".game-filters button");

const mobileMenuCheckbox =
    document.querySelector("#nav-box");

const navigationLinks =
    document.querySelectorAll(".navbar a");


/* =========================================
   CART DATA
========================================= */

const CART_STORAGE_KEY = "gameUniverseCart";

let cart = loadCart();

let activePlatform = "all";


/* =========================================
   LOCAL STORAGE
========================================= */

function loadCart() {
    try {
        const savedCart =
            localStorage.getItem(CART_STORAGE_KEY);

        if (!savedCart) {
            return [];
        }

        const parsedCart = JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart;
    } catch (error) {
        console.error("Could not load the cart:", error);

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
        console.error("Could not save the cart:", error);

        showToast(
            "The cart could not be saved.",
            "error"
        );
    }
}


/* =========================================
   CART OPEN AND CLOSE
========================================= */

function openCart() {
    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.add("cart-panel-open");
    cartOverlay.classList.add("cart-overlay-visible");

    document.body.classList.add("cart-open");

    cartPanel.setAttribute("aria-hidden", "false");
}


function closeCart() {
    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.remove("cart-panel-open");
    cartOverlay.classList.remove("cart-overlay-visible");

    document.body.classList.remove("cart-open");

    cartPanel.setAttribute("aria-hidden", "true");
}


/* =========================================
   GAME DATA
========================================= */

function getGameFromCard(gameCard) {
    if (!gameCard) {
        return null;
    }

    const name = gameCard.dataset.name;
    const price = Number(gameCard.dataset.price);
    const image = gameCard.dataset.image;
    const platform = gameCard.dataset.platform;

    if (
        !name ||
        !image ||
        !platform ||
        Number.isNaN(price) ||
        price < 0
    ) {
        console.error(
            "Invalid game information:",
            gameCard
        );

        return null;
    }

    return {
        id: createGameId(name),
        name,
        price,
        image,
        platform,
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
   ADD TO CART
========================================= */

function addGameToCart(game) {
    const existingGame = cart.find(
        (cartGame) => cartGame.id === game.id
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
    const gameCard =
        button.closest(".store-game-card");

    const game = getGameFromCard(gameCard);

    if (!game) {
        showToast(
            "This game could not be added.",
            "error"
        );

        return;
    }

    addGameToCart(game);

    const originalText = button.textContent;

    button.textContent = "Added ✓";
    button.classList.add("game-added");
    button.disabled = true;

    window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("game-added");
        button.disabled = false;
    }, 1000);
}


/* =========================================
   REMOVE AND QUANTITY
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


function changeGameQuantity(gameId, amount) {
    const game = cart.find(
        (cartGame) => cartGame.id === gameId
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
   CART TOTALS
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
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP"
    }).format(price);
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
   RENDER CART
========================================= */

function renderCart() {
    const totals = calculateCartTotals();

    if (cartCountElement) {
        cartCountElement.textContent =
            totals.quantity;

        cartCountElement.setAttribute(
            "aria-label",
            `${totals.quantity} games in cart`
        );
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

    const cartFragment =
        document.createDocumentFragment();

    cart.forEach((game) => {
        const cartItem =
            createCartItem(game);

        cartFragment.appendChild(cartItem);
    });

    cartItemsContainer.appendChild(cartFragment);

    updateCheckoutButton();
}


function renderEmptyCart() {
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
            <span aria-hidden="true">🎮</span>

            <h3>Your cart is empty</h3>

            <p>
                Add some games and begin your next
                adventure.
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

            <h3>${escapeHTML(game.name)}</h3>

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
                    aria-label="Decrease quantity of ${escapeHTML(
                        game.name
                    )}"
                >
                    −
                </button>

                <span aria-label="Quantity">
                    ${game.quantity}
                </span>

                <button
                    type="button"
                    class="increase-quantity"
                    aria-label="Increase quantity of ${escapeHTML(
                        game.name
                    )}"
                >
                    +
                </button>

            </div>

            <p class="cart-item-subtotal">
                Subtotal:
                <strong>
                    ${formatPrice(
                        game.price * game.quantity
                    )}
                </strong>
            </p>

        </div>

        <button
            type="button"
            class="remove-cart-item"
            aria-label="Remove ${escapeHTML(
                game.name
            )} from the cart"
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

    decreaseButton.addEventListener("click", () => {
        changeGameQuantity(game.id, -1);
    });

    increaseButton.addEventListener("click", () => {
        changeGameQuantity(game.id, 1);
    });

    removeButton.addEventListener("click", () => {
        removeGameFromCart(game.id);
    });

    return cartItem;
}


function updateCheckoutButton() {
    if (!checkoutButton) {
        return;
    }

    checkoutButton.disabled = cart.length === 0;
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
        "Do you want to remove every game from your cart?"
    );

    if (!confirmed) {
        return;
    }

    cart = [];

    saveCart();
    renderCart();

    showToast(
        "Your shopping cart has been cleared.",
        "info"
    );
}


/* =========================================
   CHECKOUT
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
        `Confirm your order of ` +
        `${totals.quantity} game(s) for ` +
        `${formatPrice(totals.price)}?`
    );

    if (!confirmed) {
        return;
    }

    /*
     This is a demonstration checkout.

     Do not collect real card information directly
     with basic HTML and JavaScript.

     A real website should use a secure payment
     provider such as Stripe or PayPal together
     with a backend server.
    */

    showOrderSuccess(totals);

    cart = [];

    saveCart();
    renderCart();
    closeCart();
}


function showOrderSuccess(totals) {
    const orderNumber =
        `GU-${Date.now().toString().slice(-8)}`;

    const successModal =
        document.createElement("div");

    successModal.className =
        "order-success-overlay";

    successModal.innerHTML = `
        <div
            class="order-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-success-title"
        >
            <span class="success-icon">✓</span>

            <h2 id="order-success-title">
                Purchase Successful
            </h2>

            <p>
                Thank you for buying from
                Game Universe.
            </p>

            <div class="order-summary">
                <p>
                    <span>Order number</span>
                    <strong>${orderNumber}</strong>
                </p>

                <p>
                    <span>Games</span>
                    <strong>${totals.quantity}</strong>
                </p>

                <p>
                    <span>Total</span>
                    <strong>
                        ${formatPrice(totals.price)}
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

    document.body.appendChild(successModal);
    document.body.classList.add("cart-open");

    const closeButton =
        successModal.querySelector(
            ".close-success-modal"
        );

    function removeSuccessModal() {
        successModal.remove();
        document.body.classList.remove("cart-open");
    }

    closeButton.addEventListener(
        "click",
        removeSuccessModal
    );

    successModal.addEventListener(
        "click",
        (event) => {
            if (event.target === successModal) {
                removeSuccessModal();
            }
        }
    );
}


/* =========================================
   SEARCH AND FILTERS
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
                ?.toLowerCase() || "";

        const platform =
            gameCard.dataset.platform
                ?.toLowerCase() || "";

        const category =
            gameCard
                .querySelector(".game-category")
                ?.textContent
                .trim()
                .toLowerCase() || "";

        const description =
            gameCard
                .querySelector(".game-description")
                ?.textContent
                .trim()
                .toLowerCase() || "";

        const matchesSearch =
            gameName.includes(searchText) ||
            platform.includes(searchText) ||
            category.includes(searchText) ||
            description.includes(searchText);

        const matchesPlatform =
            activePlatform === "all" ||
            platform === activePlatform ||
            platform === "multi-platform";

        const shouldDisplay =
            matchesSearch && matchesPlatform;

        gameCard.classList.toggle(
            "game-hidden",
            !shouldDisplay
        );

        if (shouldDisplay) {
            visibleGames += 1;
        }
    });

    renderSearchMessage(visibleGames);
}


function renderSearchMessage(visibleGames) {
    const gamesGrid =
        document.querySelector(".games-grid");

    if (!gamesGrid) {
        return;
    }

    let noResultsMessage =
        document.querySelector(
            "#no-games-message"
        );

    if (visibleGames === 0) {
        if (!noResultsMessage) {
            noResultsMessage =
                document.createElement("div");

            noResultsMessage.id =
                "no-games-message";

            noResultsMessage.className =
                "no-games-message";

            noResultsMessage.innerHTML = `
                <span aria-hidden="true">🔍</span>

                <h3>No games found</h3>

                <p>
                    Try another game name,
                    category or platform.
                </p>

                <button
                    type="button"
                    id="reset-game-search"
                >
                    Show All Games
                </button>
            `;

            gamesGrid.appendChild(
                noResultsMessage
            );

            const resetButton =
                noResultsMessage.querySelector(
                    "#reset-game-search"
                );

            resetButton.addEventListener(
                "click",
                resetGameSearch
            );
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}


function resetGameSearch() {
    activePlatform = "all";

    if (searchInput) {
        searchInput.value = "";
    }

    filterButtons.forEach((button) => {
        const isAllButton =
            button.dataset.filter === "all";

        button.classList.toggle(
            "filter-active",
            isAllButton
        );
    });

    filterGames();
}


/* =========================================
   TOAST NOTIFICATIONS
========================================= */

function showToast(message, type = "info") {
    let toastContainer =
        document.querySelector(
            "#toast-container"
        );

    if (!toastContainer) {
        toastContainer =
            document.createElement("div");

        toastContainer.id = "toast-container";
        toastContainer.className =
            "toast-container";

        document.body.appendChild(
            toastContainer
        );
    }

    const toast =
        document.createElement("div");

    toast.className = `toast toast-${type}`;

    toast.innerHTML = `
        <span class="toast-symbol">
            ${getToastIcon(type)}
        </span>

        <p>${escapeHTML(message)}</p>

        <button
            type="button"
            aria-label="Close notification"
        >
            &times;
        </button>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("toast-visible");
    });

    const closeButton =
        toast.querySelector("button");

    closeButton.addEventListener("click", () => {
        removeToast(toast);
    });

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

    return icons[type] || icons.info;
}


function removeToast(toast) {
    if (!toast || !toast.isConnected) {
        return;
    }

    toast.classList.remove("toast-visible");

    window.setTimeout(() => {
        toast.remove();
    }, 300);
}


/* =========================================
   SECURITY
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
   EVENTS
========================================= */

addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
        handleAddToCart(button);
    });
});


filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activePlatform =
            button.dataset.filter || "all";

        filterButtons.forEach(
            (filterButton) => {
                filterButton.classList.remove(
                    "filter-active"
                );
            }
        );

        button.classList.add("filter-active");

        filterGames();
    });
});


if (searchInput) {
    searchInput.addEventListener(
        "input",
        filterGames
    );

    searchInput.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
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


document.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "Escape") {
            closeCart();
        }
    }
);


navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (mobileMenuCheckbox) {
            mobileMenuCheckbox.checked = false;
        }
    });
});


/* =========================================
   START WEBSITE
========================================= */

renderCart();
filterGames();