export default class HomePage {
  async render() {
    return `
      <section class="container ">
        <h1 class="left-align" id="home-title">Ready to <b id="home-title-bold">Reserve?</b></h1>
        <div id="property-container">
            <div class="row">
              <div class="card">
                <div class="card-content">
                  <span class="card-title white-text">Card Title</span>
                  <p class="card-text white-text">Apartment-Unit location, Unit Size</p>
                </div>
              </div>
            </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
    this.showPropertyCard()

  }

  showPropertyCard() {
    const propertyContainer = document.querySelector('#property-container');
    //DEBUG Change to only =
    propertyContainer.innerHTML += this.createPropertyCard({"name":"Cempaka Emas Complex", "type":"apartment", "location":"Block A", "size":"Small"});
  }

  createPropertyCard(property) {
    return `
      <div class="row">
        <div class="card">
          <div class="card-content">
            <span class="card-title white-text">${property.name}</span>
            <p class="card-text white-text">${property.type}-${property.location}, ${property.size}</p>
          </div>
        </div>
      </div>
    `;
  }
}
