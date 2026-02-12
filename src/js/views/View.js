import icons from "url:../../img/icons.svg";

export default class View {
    _data;

    /**
     * Render the Received Object to the DOM
     * @param {Object | Object[]} data - The Data to be Rendered (e.g. Recipe)
     * @param {boolean} [render = true] - If False, Create Markup String Instead of Rendering to the DOM.
     * @returns {undefined | string} - A Markup String is Returned if Render = False
     * @this {Object} View Instance
     * @author Klaus
     * @todo Finish Implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };

    update(data) {
        // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll("*"));
        const curElements = Array.from(this._parentElement.querySelectorAll("*"));
        
        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            // Updates Changed TEXT
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== "") curEl.textContent = newEl.textContent;

            // Updates Changed ATTRIBUTE
            if (!newEl.isEqualNode(curEl)) Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
        });
    };

    _clear() {
        this._parentElement.innerHTML = "";
    };

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };

    renderError(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };

    renderMessage(message = this._message) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };
};