class Tabs extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="tabs is-centered is-boxed is-medium">
                <ul>
                    <li class="search-item">
                    <a href="../src/index.html" id="swap-to-search">
                        <span class="icon is-small"><i class="fas fa-search" aria-hidden="true"></i></span>
                        <span>Chercher via une adresse</span>
                    </a>
                    </li>
                    <li class="poi-item">
                        <a href="../src/poi.html" id="swap-to-poi">
                            <span class="icon is-small"><i class="fas fa-map" aria-hidden="true"></i></span>
                            <span>Gérer les centres d'intérêt</span>
                        </a>
                    </li>
                </ul>
            </div>
        `
        const path = window.location.pathname.split('/')[3]
        const poi = document.querySelector('.poi-item')
        const search = document.querySelector('.search-item')
        if(path === "poi.html") {
            poi.classList.add('is-active')
            search.classList.remove('is-active')
        } else if (path === "index.html") {
            poi.classList.remove('is-active')
            search.classList.add('is-active')
        }
    }
}

customElements.define('tabs-component', Tabs)