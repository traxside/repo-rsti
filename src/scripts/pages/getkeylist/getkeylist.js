export default class GetKeyListPage {
  async render() {
    return `
        <div class="container row center-align header-reservation">
            <a class="col back" href="#/reservationslist"><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
            <h1 class="reserve title two">Kuningan Apartment</h1>
        </div>
        <section class="container">
  
          <div class="profile title">Check Out</div>
          
          <div class="card-panel z-depth-0 center-align key-container">000000</div>
          
          <div class="profile title">House Rules</div>
          <!-- Tambah padding -->
          <div class="container rules-element">
              <ol>
              <li>Check-In Code is used to lock/unlock the property</li>
              <li>Check-In will be available at 12 PM</li>
              <li>Check-Out will be available at 11 AM</li>
              <li>Please note that all furniture and accessories are part of the property and are not complimentary. Kindly do not remove or take any items from the premises</li>
              </ol>
          </div>
  
          <!-- Button -->
          <div class="container profile">
              <!-- Check Out Button dibuat agar data di database hilang -->
              <a class="waves-effect waves-light btn">Check Out</a>
              <a class="waves-effect waves-light btn merah">Chat - Not Available</a>
          </div>
        
        </section>
    `;
  }

  async afterRender() {

  }



}