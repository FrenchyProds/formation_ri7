const errorTemplate = (content) => `
    <div class="card mx-auto mt-5">
        <div class="card-header">
            <div class="card-header-title title has-background-danger has-text-white">Erreur</div>
        </div>
        <div class="card-content">
            ${content}
        </div>
    <div>
`

export default errorTemplate