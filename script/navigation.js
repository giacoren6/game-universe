"use strict";


export function initNavigation() {
    const mobileMenuCheckbox =
        document.querySelector(
            "#nav-box"
        );

    const navigationLinks =
        document.querySelectorAll(
            ".navbar a"
        );

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
}