"use strict";

import {
    escapeHTML,
    formatPlatform,
    formatPrice
} from "./utils.js";

import { showToast } from "./toast.js";


const CART_STORAGE_KEY =
    "gameUniverseCart";

let cart = [];


let cartButton;
let cartPanel;
let cartOverlay;
let closeCartButton;

let cartItemsContainer;
let cartCountElement;
let cartTotalElement;

let clearCartButton;
let checkoutButton;


export function initCart() {
    cartButton =
        document.querySelector(
            "#cart-button"
        );

    cartPanel =
        document.querySelector(
            "#cart-panel"
        );

    cartOverlay =
        document.querySelector(
            "#cart-overlay"
        );

    closeCartButton =
        document.querySelector(
            "#close-cart"
        );

    cartItemsContainer =
        document.querySelector(
            "#cart-items"
        );

    cartCountElement =
        document.querySelector(
            "#cart-count"
        );

    cartTotalElement =
        document.querySelector(
            "#cart-total"
        );

    clearCartButton =
        document.querySelector(
            "#clear-cart"
        );

    checkoutButton =
        document.querySelector(
            "#checkout-button"
        );

    cart = loadCart();

    const addToCartButtons =
        document.querySelectorAll(
            ".add-to-cart"
        );

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

    renderCart();
}


/* LOCAL STORAGE */

function loadCart() {
    try {
        const savedCart =
            localStorage.getItem(
                CART_STORAGE_KEY
            );

        if (!savedCart) {
            return [];
        }

        const parsedCart =
            JSON.parse(savedCart);

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart;

    } catch (error) {
        console.error(
            "Could not load cart:",
            error
        );

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
        console.error(
            "Could not save cart:",
            error
        );

        showToast(
            "The cart could not be saved.",
            "error"
        );
    }
}


/* OPEN AND CLOSE CART */

function openCart() {
    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.add(
        "cart-panel-open"
    );

    cartOverlay.classList.add(
        "cart-overlay-visible"
    );

    document.body.classList.add(
        "cart-open"
    );

    cartPanel.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeCart() {
    if (!cartPanel || !cartOverlay) {
        return;
    }

    cartPanel.classList.remove(
        "cart-panel-open"
    );

    cartOverlay.classList.remove(
        "cart-overlay-visible"
    );

    document.body.classList.remove(
        "cart-open"
    );

    cartPanel.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* GAME INFORMATION */

function getGameFromCard(gameCard) {
    if (!gameCard) {
        return null;
    }

    const name =
        gameCard.dataset.name;

    const price =
        Number(gameCard.dataset.price);

    const image =
        gameCard.dataset.image;

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
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-|-$/g,
            ""
        );
}


/* ADD TO CART */

function addGameToCart(game) {
    const existingGame =
        cart.find(
            (cartGame) => {
                return (
                    cartGame.id ===
                    game.id
                );
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
    const gameCard =
        button.closest(
            ".store-game-card"
        );

    const game =
        getGameFromCard(gameCard);

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

    button.textContent =
        "Added ✓";

    button.classList.add(
        "game-added"
    );

    button.disabled = true;

    window.setTimeout(() => {
        button.textContent =
            originalText;

        button.classList.remove(
            "game-added"
        );

        button.disabled = false;
    }, 1000);
}


/* REMOVE GAME */

function removeGameFromCart(gameId) {
    const gameToRemove =
        cart.find(
            (game) => {
                return (
                    game.id === gameId
                );
            }
        );

    cart = cart.filter(
        (game) => {
            return (
                game.id !== gameId
            );
        }
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


/* CHANGE QUANTITY */

function changeGameQuantity(
    gameId,
    amount
) {
    const game =
        cart.find(
            (cartGame) => {
                return (
                    cartGame.id ===
                    gameId
                );
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


/* CALCULATE TOTAL */

function calculateCartTotals() {
    return cart.reduce(
        (totals, game) => {
            totals.quantity +=
                game.quantity;

            totals.price +=
                game.price *
                game.quantity;

            return totals;
        },
        {
            quantity: 0,
            price: 0
        }
    );
}


/* DISPLAY CART */

function renderCart() {
    const totals =
        calculateCartTotals();

    if (cartCountElement) {
        cartCountElement.textContent =
            totals.quantity;
    }

    if (cartTotalElement) {
        cartTotalElement.textContent =
            formatPrice(
                totals.price
            );
    }

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML =
        "";

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

            <h3>
                Your cart is empty
            </h3>

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
        cartItemsContainer
            .querySelector(
                ".continue-shopping-button"
            );

    if (continueShoppingButton) {
        continueShoppingButton
            .addEventListener(
                "click",
                closeCart
            );
    }
}


function createCartItem(game) {
    const cartItem =
        document.createElement(
            "article"
        );

    cartItem.className =
        "cart-item";

    cartItem.dataset.cartId =
        game.id;

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
                    formatPlatform(
                        game.platform
                    )
                )}
            </p>

            <p class="cart-item-price">
                ${formatPrice(
                    game.price
                )}
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


/* CLEAR CART */

function clearCart() {
    if (cart.length === 0) {
        showToast(
            "Your cart is already empty.",
            "info"
        );

        return;
    }

    const confirmed =
        window.confirm(
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


/* CHECKOUT */

function checkout() {
    if (cart.length === 0) {
        showToast(
            "Your cart is empty.",
            "error"
        );

        return;
    }

    const totals =
        calculateCartTotals();

    const confirmed =
        window.confirm(
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
        document.createElement(
            "div"
        );

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
                    <span>
                        Order number
                    </span>

                    <strong>
                        ${orderNumber}
                    </strong>
                </p>

                <p>
                    <span>
                        Games
                    </span>

                    <strong>
                        ${totals.quantity}
                    </strong>
                </p>

                <p>
                    <span>
                        Total
                    </span>

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