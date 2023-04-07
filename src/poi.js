import errorTemplate from './modules/errorTemplate.mjs'
import Tabs from '../src/components/Tabs.js'
import style from '../assets/css/style.scss'
import Swal from 'sweetalert2'

window.onload = () => {
    const card = document.getElementById('card-container')

    const storedPoi = JSON.parse(localStorage.getItem("poi")) ? JSON.parse(localStorage.getItem("poi")) : []

    if (storedPoi.length === 0) {
        card.innerHTML = errorTemplate('<p>Il n\'y a aucun centre d\'intérêt pour l\'instant, vous pouvez en créer un sur <a href="../src/index.html">cet onglet</a></p>')
    }
    
    storedPoi.forEach(poi => {
        const {id, housenumber, street, citycode, city} = poi.properties
        const {name, description} = poi
        card.innerHTML += 
        `
        <div class="column is-4 is-flex is-flex-wrap-wrap">
        <div class="card is-flex is-flex-direction-column is-justify-content-space-between is-flex-grow-1" id="container${id}">
            <div class="card-content">
                <div class="content">
                    <div class="poi-content mb-3">
                        <p class="is-size-4 m-0 capitalize">${name}</p>
                        <p class="is-size-5">${description}</p>
                    </div>
                    <div class="place-recap capitalize">
                        <p class="m-0">${housenumber || ""} ${street ? street + ',': ""} ${citycode || "code postal"}, ${city || "ville"}</p>
                    </div>
                </div>
            </div>
            <footer class="is-flex is-justify-content-center">
                <button data-id=${id} class="button is-danger mb-2 delete-button">
                    <span class="icon is-small">
                        <i class="fas fa-trash"></i>
                    </span>
                </button>
            </footer>
        </div>
    </div>
        `
    })

    const deletePoiButtons = card.querySelectorAll('.delete-button')

    deletePoiButtons.forEach(button => {
        button.addEventListener('click', () => {
            Swal.fire({
                title: 'Êtes vous sûr ?',
                text: "Cette action est irréversible !",
                icon: 'warning',
                confirmButtonText: 'Confirmer',
                cancelButtonText: 'Annuler',
                showCancelButton: true,
              }).then(result => {
                if(result.isConfirmed) {
                    const item = storedPoi.find(poi => poi.properties.id === button.dataset.id)
                    console.log(item)
                    const updatedPoi = storedPoi.filter(poi => poi.properties.id !== item.properties.id)
                    console.log(storedPoi)
                    localStorage.setItem('poi', JSON.stringify(updatedPoi))
                    location.reload()
                }
              })
              
            
        })
    })

}