import { getProperties } from '../../data/api';

export default class HomePage {
  constructor() {
    this.properties = [];
  }

  async render() {
    return `
      <section class="container">
        <h1 class="left-align" id="home-title">Ready to <b id="home-title-bold">Reserve?</b></h1>
        <div id="property-container">
        </div>
      </section>
    `;
  }

  async afterRender() {
    const body = document.querySelector('body');
    body.style.backgroundColor = 'white';

    await this.loadProperties();
  }

  async loadProperties() {
    try {
      this.properties = await getProperties();
      this.displayProperties();
    } catch (error) {
      console.error('Error loading properties:', error);
      this.displayError();
    }
  }

  displayProperties() {
    const propertyContainer = document.querySelector('#property-container');

    if (this.properties.length === 0) {
      propertyContainer.innerHTML = `
        <div class="center-align" style="padding: 40px;">
          <p style="color: #7164B1;">No properties available</p>
        </div>
      `;
      return;
    }

    propertyContainer.innerHTML = this.properties
        .map(property => this.createPropertyCard(property))
        .join('');

    // Add click handlers for each property card
    this.properties.forEach(property => {
      const card = document.querySelector(`[data-property-id="${property.id}"]`);
      if (card) {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.hash = `#/reservation/${property.id}`;
        });
      }
    });
  }

  displayError() {
    const propertyContainer = document.querySelector('#property-container');
    propertyContainer.innerHTML = `
      <div class="center-align" style="padding: 40px;">
        <p style="color: #D45656;">Error loading properties. Please try again.</p>
        <button onclick="location.reload()" style="background: #7164B1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }

  createPropertyCard(property) {
    const formattedPrice = new Intl.NumberFormat('id-ID').format(property.price);

    return `
      <div class="row">
        <a href="#/reservation/${property.id}" class="card" data-property-id="${property.id}" style="display: block; text-decoration: none;">
          <div class="card-content">
            <span class="card-title white-text">${property.name}</span>
            <p class="card-text white-text">${property.type} - ${property.unit}, ${property.size}</p>
            <p class="card-text white-text" style="margin-top: 8px; font-size: 12px;">Rp ${formattedPrice}/day</p>
          </div>
        </a>
      </div>
    `;
  }
}