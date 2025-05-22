export default class ReservationsListPage {
    async render(){
        return `
        <div class="container row valign-wrapper">
            <a class="col back" href="#/profile"><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
            <div class="reserve title two">Reservations List</div>
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