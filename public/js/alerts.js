
export const hideAlert = () => {
    const alert = document.querySelector('.alert');
    if (alert) {
        alert.remove();
    }
}

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div className="alert alert--${type}">{msg}</div> `;
    document.querySelector('body').insertAdjacentElement('afterbegin', markup);
    setTimeout(() => {
        hideAlert();
    }, 3000);
};