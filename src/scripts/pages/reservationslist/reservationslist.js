export default class ReservationsListPage {
    async render(){
        return `
        <div class="container">
            <div class="reserve title">Reservations List</div>
        </div>

        <div class="container">
            <div class="card-panel property">
                <a class="property-detail class" href=#reservation>
                    <div class="property-title">Kuningan Apartment</div>
                    <div class="property-desc">21/03/2025 - 23/03/2025</div>
                </a>
            </div>
        </div>
        `
    }

    async afterRender(){

    }
}