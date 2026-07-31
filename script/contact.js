"use strict";

import { escapeHTML } from "./utils.js";
import { showToast } from "./toast.js";


export function initContactForm() {
    const contactForm =
        document.querySelector(
            "#contact-form"
        );

    if (!contactForm) {
        return;
    }

    contactForm.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            const firstNameInput =
                document.querySelector(
                    "#first-name"
                );

            const firstName =
                firstNameInput
                    ? firstNameInput
                        .value
                        .trim()
                    : "";

            showContactSuccess(
                firstName
            );

            contactForm.reset();
        }
    );
}


function showContactSuccess(
    firstName
) {
    const overlay =
        document.createElement(
            "div"
        );

    overlay.className =
        "contact-success-overlay";

    const customerName =
        firstName
            ? `, ${escapeHTML(firstName)}`
            : "";

    overlay.innerHTML = `
        <div
            class="contact-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
        >

            <span
                class="contact-success-icon"
                aria-hidden="true"
            >
                ✓
            </span>

            <h2 id="contact-success-title">
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

    document.body.appendChild(
        overlay
    );

    document.body.style.overflow =
        "hidden";

    const closeButton =
        overlay.querySelector(
            ".close-contact-success"
        );


    function closeModal() {
        if (!overlay.isConnected) {
            return;
        }

        overlay.remove();

        document.body.style.overflow =
            "";

        document.removeEventListener(
            "keydown",
            closeWithEscape
        );

        showToast(
            "Thanks for contacting Game Universe!",
            "success"
        );
    }


    function closeWithEscape(
        event
    ) {
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
        (event) => {
            if (
                event.target ===
                overlay
            ) {
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