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
          <div class="center-align" style="padding: 40px;">
            <p style="color: #7164B1;">Loading properties...</p>
          </div>
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
      console.log('Loading properties...');
      const response = await getProperties();

      console.log('Properties API response:', response);

      if (response.success) {
        // The API returns { success: true, properties: [...] }
        this.properties = response.properties || [];
        console.log('Properties loaded:', this.properties);
        this.displayProperties();
      } else {
        console.error('Failed to load properties:', response.error);
        this.displayError(response.error || 'Failed to load properties');
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      this.displayError('Network error occurred while loading properties');
    }
  }

  displayProperties() {
    const propertyContainer = document.querySelector('#property-container');

    if (!propertyContainer) {
      console.error('Property container not found');
      return;
    }

    if (!this.properties || this.properties.length === 0) {
      propertyContainer.innerHTML = `
        <div class="center-align" style="padding: 40px;">
          <p style="color: #7164B1;">No properties available</p>
          <button onclick="location.reload()" style="background: #7164B1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 10px;">
            Refresh
          </button>
        </div>
      `;
      return;
    }

    console.log('Displaying properties:', this.properties.length);

    propertyContainer.innerHTML = this.properties
        .map(property => this.createPropertyCard(property))
        .join('');

    // Add click handlers for each property card
    this.properties.forEach(property => {
      console.log('hey', property.prop_id);
      const card = document.querySelector(`[data-property-id="${property.prop_id}"]`);
      if (card) {
        card.addEventListener('click', (e) => {
          e.preventDefault();
          console.log('Navigating to property:', property.prop_id);
          window.location.hash = `#/reservation/${property.prop_id}`;
        });
      }
    });
  }

  displayError(errorMessage = 'Error loading properties. Please try again.') {
    const propertyContainer = document.querySelector('#property-container');

    if (!propertyContainer) {
      console.error('Property container not found');
      return;
    }

    propertyContainer.innerHTML = `
      <div class="center-align" style="padding: 40px;">
        <p style="color: #D45656;">${errorMessage}</p>
        <button onclick="location.reload()" style="background: #7164B1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 10px;">
          Retry
        </button>
      </div>
    `;
  }

  createPropertyCard(property) {
    // Handle different possible property structures from the API
    const propertyName = property.name || property.title || `Property ${property.prop_id}`;
    const propertyType = property.type || 'Property';
    const propertyUnit = property.unit || '';
    const propertySize = property.size || '';
    const propertyPrice = property.price || 0;
    const propertyLocation = property.location || '';

    // Handle price - it might be a string from API, so convert to number
    const numericPrice = typeof propertyPrice === 'string' ? parseFloat(propertyPrice) || 0 : propertyPrice;
    const formattedPrice = new Intl.NumberFormat('id-ID').format(numericPrice);

    // Build description parts
    const descriptionParts = [propertyType];
    if (propertyUnit) descriptionParts.push(propertyUnit);
    if (propertySize) descriptionParts.push(propertySize);
    if (propertyLocation) descriptionParts.push(propertyLocation);

    const description = descriptionParts.join(' - ');

    return `
      <div class="row">
        <a href="#/reservation/${property.prop_id}" class="card" data-property-id="${property.prop_id}" style="display: block; text-decoration: none;">
          <div class="card-content">
            <span class="card-title white-text">${propertyName}</span>
            <p class="card-text white-text">${description}</p>
            <p class="card-text white-text" style="margin-top: 8px; font-size: 12px;">Rp ${formattedPrice}/day</p>
          </div>
        </a>
      </div>
    `;
  }
}