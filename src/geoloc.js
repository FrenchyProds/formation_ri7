import errorTemplate from './modules/errorTemplate.mjs'
import Tabs from '../src/components/Tabs.js'
import style from '../assets/css/style.scss'
import Swal from 'sweetalert2'
import haversine from 'haversine-distance'

window.onload = () => {

    const card = document.getElementById('card-container')

    const storedPoi = JSON.parse(localStorage.getItem('poi')) 
    ? JSON.parse(localStorage.getItem('poi'))
    : []

    const sortedPoi = []

    let userPos

    storedPoi.forEach(poi => {
        const geo = poi.geometry.coordinates
        const poiPositions = {
            lat: geo[1],
            lng: geo[0]
        }
        userPos = poi.userPosition
        const distanceInM = haversine(userPos, poiPositions)
        sortedPoi.push({...poi, distanceInM})
        return sortedPoi, userPos
    })
    sortedPoi.sort((a, b) =>
        a.distanceInM < b.distanceInM ? -1 : 1
    )

    const checked = "checked"

    sortedPoi.forEach(poi => {
        const cleanDistanceInKM = parseFloat(poi.distanceInM/1000).toFixed(2) + ' km'
        const {name, description} = poi
        const {id, housenumber, street, citycode, city} = poi.properties
        const lat = poi.geometry.coordinates[1]
        const lng = poi.geometry.coordinates[0]
        card.innerHTML += 
        `
            <div class="column is-flex is-flex-wrap-wrap">
                <div class="card is-flex is-flex-direction-column is-justify-content-space-between is-align-items-center is-flex-grow-1" id="container${id}">
                    <div class="is-flex is-flex-direction-row">
                        <div class="card-content column is-flex is-align-items-center">
                            <div class="content">
                                <div class="poi-content mb-3">
                                    <p class="is-size-4 m-0 capitalize">${name}</p>
                                    <p class="is-size-5">${description}</p>
                                </div>
                                <div class="place-recap capitalize">
                                    <p class="m-0">${housenumber || ""} ${street ? street + ',': ""} ${citycode || "code postal"}, ${city || "ville"}</p>
                                    
                                    <button data-id="${id}" class="button is-outlined is-size-6 is-primary mt-5 capitalize distance">Distance : ${cleanDistanceInKM}</button>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="field">
                                <input id="switchToImage" type="checkbox" class="switch is-rounded is-success" checked="checked">
                                <label class="map-label" for="switchToImage">Carte</label>
                                <label class="photo-label" for="switchToMap">Photo</label>
                            </div>
                            <div id="map_${id}" data-coords="${[lat, lng]}" data-description="${description}" data-name="${name}" data-address="${housenumber || ""} ${street ? street + ',': ""} ${citycode || "code postal"}, ${city || "ville"}" data-distance="${cleanDistanceInKM}" class="map"></div>
                        </div>
                    </div>
                </div>
            </div>
        `
    })

    

    const switchButton = document.querySelector('#switchToImage')
    switchButton.addEventListener('click', event => {
        console.log(event)
        if (event.target.checked) {
            // checked = false
            console.log("not checked")
        } else {
            // checked = true
            console.log("checked")
        }
    })

    const maps = document.querySelectorAll('.map')
        maps.forEach(item => {
            const lat = item.dataset.coords.split(',')[0] 
            const lng = item.dataset.coords.split(',')[1] 
            const {name, description, address} = item.dataset
            
           const map = new L.map(item.id).setView([lat, lng], 13)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

            const group = new L.featureGroup()

            const poiMarker = L.marker([lat, lng]).addTo(map)
            poiMarker.bindPopup(`<b>${name}</b><br />${description}<br />${address}`)
            poiMarker.addTo(group)

            const redIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              });

            const userMarker = L.marker([userPos.lat, userPos.lng], {icon: redIcon}).addTo(map)
            userMarker.bindPopup('<b>Ma position actuelle</b>')
            userMarker.addTo(group)

            // const markers = L.markerClusterGroup()


            const distanceButtons = document.querySelectorAll('.distance')
            distanceButtons.forEach(button => {
               if ('map_' + button.dataset.id === item.id)
                button.addEventListener('click', () => {
                    map.fitBounds(group.getBounds())
                })
            })
        })
    
}

