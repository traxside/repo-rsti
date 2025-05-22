export default class ReservationsListPage {
    async render(){
        return `
        <div class="container row center-align header-reservation">
            <a class="col back" href="#/profile"><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
            <div class="reserve title two">Reservations List</div>
        </div>  
        
        <section class="container reservation-list-container">
    
            <div class="container">
                <div class="card-panel property">
                    <a class="property-detail class" href="#/getkeylist">
                        <div class="property-title">Kuningan Apartment</div>
                        <div class="property-desc">21/03/2025 - 23/03/2025</div>
                    </a>
                </div>
            </div>
        </section>
        `
    }

    async afterRender(){

    }
}