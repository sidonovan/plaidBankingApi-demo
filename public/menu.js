import { menuItemSearchEl } from './common.js';
const menuClickHandler = (event) => {
    // prevent default behaviour
    event.preventDefault();
    // get clicked menu item element
    const menuItemEl = event.target.closest('.menu__item');
    // remove the active class from previously active menu item
    // (first check to see if previously active menu item
    // exists)
    const activeMenuItemEL = document.querySelector('.menu__button-style--active');
    if (activeMenuItemEL) {
        activeMenuItemEL.classList.remove('menu__button-style--active');
    }
    // add active class
    if (menuItemEl) {
        menuItemEl.classList.add('menu__button-style--active');
    }
};
if (menuItemSearchEl) {
    menuItemSearchEl.addEventListener('click', menuClickHandler);
}
