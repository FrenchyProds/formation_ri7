import errorTemplate from './modules/errorTemplate.mjs'

window.onload = () => {

    const card = document.getElementById('card-container')

    let storedPoi

    storedPoi = JSON.parse(localStorage.getItem("poi")) ? JSON.parse(localStorage.getItem("poi")) : []

    if (storedPoi.length === 0) {
        card.innerHTML = errorTemplate('<p>Il n\'y a aucun centre d\'intérêt pour l\'instant, vous pouvez en créer un sur <a href="../src/index.html">cet onglet</a></p>')
    }
    
    storedPoi.forEach(poi => {
        const {id, housenumber, street, citycode, city, name, description} = poi
        card.innerHTML += 
        `
        <div class="column is-4 is-flex-wrap-wrap">
        <div class="card" id="container${id}">
            <div class="card-content">
                <div class="content">
                    <div class="poi-content mb-3">
                        <p class="is-size-4 m-0">${name}</p>
                        <p class="is-size-5">${description}</p>
                    </div>
                    <div class="place-recap">
                        <p class="m-0">${housenumber || "#"} ${street || "rue"}, ${citycode || "code postal"}, ${city || "ville"}</p>
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
            const item = storedPoi.find(poi => poi.id === button.dataset.id)
            const updatedPoi = storedPoi.filter(poi => poi.id !== item.id)
            console.log(storedPoi)
            localStorage.setItem('poi', JSON.stringify(updatedPoi))
            location.reload()
        })
    })

}