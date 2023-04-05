const openModal = ($el) =>
    $el.classList.add('is-active')

const closeModal = ($el) =>{
    $el.classList.remove('is-active')
    $el.id = 'modal-container'}

const closeAllModals = () => {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
    })
}

const initModals = () =>

(document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
        openModal($target);
    });
});

(document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
        closeModal($target);
    });
});

document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.key === "Escape") { // Escape key
        closeAllModals();
    }
})

export {openModal, closeAllModals, closeModal, initModals}