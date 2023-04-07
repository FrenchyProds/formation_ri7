export class Tabs extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="tabs is-centered is-boxed is-medium">
                <ul>
                    <li class="search-item is-active">
                    <a href="/index.html" id="swap-to-search">
                        <span class="icon is-small"><i class="fas fa-search" aria-hidden="true"></i></span>
                        <span>Chercher via une adresse</span>
                    </a>
                    </li>
                    <li class="poi-item">
                        <a href="/poi.html" id="swap-to-poi">
                            <span class="icon is-small"><i class="fas fa-map" aria-hidden="true"></i></span>
                            <span>Gérer les centres d'intérêt</span>
                        </a>
                    </li>
                    <li class="geoloc-item">
                        <a href="/geoloc.html" id="swap-to-geoloc">
                            <span class="icon is-small"><i class="fas fa-map-pin" aria-hidden="true"></i></span>
                            <span>Points d'intérêt à proximité</span>
                        </a>
                    </li>
                </ul>
            </div>
        `
        const path = window.location.pathname
        const poi = document.querySelector('.poi-item')
        const search = document.querySelector('.search-item')
        const geoloc = document.querySelector('.geoloc-item')
        if(path.includes('poi')) {
            poi.classList.add('is-active')
            search.classList.remove('is-active')
            geoloc.classList.remove('is-active')
        } else if (path.includes('index')) {
            poi.classList.remove('is-active')
            geoloc.classList.remove('is-active')
            search.classList.add('is-active')
        } else if (path.includes('geoloc')) {
            poi.classList.remove('is-active')
            geoloc.classList.add('is-active')
            search.classList.remove('is-active')
        }
    }
}

customElements.get('tabs-component') || customElements.define('tabs-component', Tabs)