import { slugify } from "./modules/utils.mjs"
import {openModal, closeModal, initModals} from "./modules/modal.mjs"
import errorTemplate from './modules/errorTemplate.mjs'
import loadingTemplate from './modules/loadingTemplate.mjs'
import Tabs from '../src/components/Tabs.js'
import axios from "axios"
import Swal from 'sweetalert2'

window.onload = () => {
    const searchButton = document.querySelector('#submit-button')
    const searchBar = document.querySelector('#search-bar')
    const card = document.getElementById('card-container')

    initModals()

    searchBar.addEventListener("keyup", function(event) {
        event.preventDefault()
        if(event.key === "Enter") searchButton.click()
    })


    searchButton.addEventListener('click', async () => {
        const searchContent = document.getElementById('search-bar').value

        const sluggedText = slugify(searchContent)

        if(sluggedText.length <= 2) return card.innerHTML = 
            errorTemplate(
            `<p class="has-text-danger">Merci de bien vouloir renseigner au moins 3 caractères avant de tenter une recherche</p>`
            )

        try {
           await axios(`https://api-adresse.data.gouv.fr/search/?q=${sluggedText}&limit=15`).then(res => {
                const data = res.data.features
                let results = []
                let loading = true
                data.forEach(item => {
                    const {label, city, context} = item.properties
                    if (slugify(label).includes(sluggedText) || slugify(city).includes(sluggedText) || slugify(context).includes(sluggedText)) {
                        results.push(item.properties)
                        return results
                    }
                })

                if (results.length === 0 && searchContent.length >= 3) { 
                    card.innerHTML = errorTemplate(
                        `<p class="has-text-danger">Aucun résultat ne correspond à votre recherche, merci de bien vouloir essayer autre chose</p>`
                    )
                } else if(loading) {
                    card.innerHTML = loadingTemplate()
                    document.querySelector('.searchbar-container').classList.add('is-loading')
                    setTimeout(() => {
                        card.innerHTML = ''
                    }, 2000)
                }
                
                setTimeout(() => results.forEach(res => {
                    const {label, city, context, id} = res
                    if (document.getElementById(`container${id}`)) return
                    card.innerHTML += 
                    `
                    <div class="column is-4 is-flex-wrap-wrap">
                        <div class="card" id="container${id}">
                            <header class="card-header" background-color="blue">
                                <p class="card-header-title">${label}</p>
                            </header>
                            <div class="card-content">
                                <div class="content">
                                    <p>Ville : ${city}</p>
                                    <p>Département : ${context}</p>
                                </div>
                            </div>
                            <footer class="is-flex is-justify-content-center">
                                <button data-target="${id}" class="button is-info mb-2 js-modal-trigger">
                                    <span class="icon is-small">
                                        <i class="fas fa-arrow-right"></i>
                                    </span>
                                </button>
                            </footer>
                        </div>
                    </div>
                    `
                }, 
                    loading = false, 
                    document.querySelector('.searchbar-container').classList.remove('is-loading')), 
                2000)
                
                setTimeout(() => {
                    const openModalButtons = card.querySelectorAll('.js-modal-trigger')

                    openModalButtons.forEach(openModalButton => {
                        openModalButton.addEventListener("click", () => {
                            const item = results.find(item => item.id === openModalButton.dataset.target)
                            localStorage.setItem('search', JSON.stringify(item))
                            const modalTarget = document.getElementById("modal-container")
                            modalTarget.id = "modal-container " + openModalButton.dataset.target
                            const modalTitle = modalTarget.querySelector(".modal-card-title")
                            const modalContent = modalTarget.querySelector(".modal-card-body")
                            modalTitle.innerHTML = "Ajouter un point d'intérêt"
                            modalContent.innerHTML = `
                            <div class="my-3">
                                <p class="title is-5">Adresse : ${item.name}, ${item.context}</p>
                            </div>
                            <div class="field">
                                <label class="label">Nom</label>
                                <div class="control">
                                    <input class="input create-poi-name" type="text" placeholder="Nom du point d'intérêt">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Description</label>
                                <div class="control">
                                    <textarea class="textarea create-poi-description" placeholder="Description du point d'intérêt"></textarea>
                                </div>
                            </div>

                            <div class="field is-grouped">
                                <div class="control">
                                    <button class="button is-link confirm-form">Valider</button>
                                </div>
                                <div class="control">
                                    <button class="button is-link is-light cancel-form">Annuler</button>
                                </div>
                            </div>

                            `
                            openModal(modalTarget);
                            modalContent.querySelector('.cancel-form').addEventListener("click", () => {
                                closeModal(modalTarget)
                            })

                            modalContent.querySelector('.confirm-form').addEventListener("click", () => {
                                const name = document.querySelector('.create-poi-name')
                                const description = document.querySelector('.create-poi-description')
                        
                                if(!name.value || !description.value) return modalContent.innerHTML += errorTemplate('<p>Merci de bien vouloir renseigner les deux champs avant de valider</p>')

                                const getPOI = JSON.parse(localStorage.getItem('poi'))
                                    ? JSON.parse(localStorage.getItem('poi'))
                                    : []

                                const filteredArray = getPOI.filter(poi => poi.id !== item.id) || []

                                filteredArray.push({...item, 'name': name.value, 'description': description.value, 'id': item.id})
                        
                                localStorage.setItem('poi', JSON.stringify(filteredArray))
                                Swal.fire({
                                    title: 'Point d\'intérêt crée',
                                    text: 'Votre point d\'intérêt a bien été crée',
                                    icon: 'success',
                                })
                                closeModal(modalTarget)
                            })
                        });
                    })
                }, 2000)
            })
        } catch (error) {
            card.innerHTML = errorTemplate(`<p>${error}</p>`)
        }
    })
}