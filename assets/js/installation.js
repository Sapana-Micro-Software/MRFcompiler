"use strict";
// Installation page specific functionality
// Copyright (C) 2025, Shyamal Suhana Chandra
function initInstallationPage() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            // Remove active class from all
            tabButtons.forEach((btn) => btn.classList.remove('active'));
            tabContents.forEach((content) => content.classList.remove('active'));
            // Activate selected tab
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab || '');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', initInstallationPage);
//# sourceMappingURL=installation.js.map