"use strict";

import { escapeHTML } from "./utils.js";


export function showToast(
    message,
    type = "info"
) {
    let toastContainer =
        document.querySelector(
            "#toast-container"
        );

    if (!toastContainer) {
        toastContainer =
            document.createElement("div");

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

    return icons[type] || icons.info;
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