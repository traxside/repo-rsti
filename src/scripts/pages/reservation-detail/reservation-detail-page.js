import { getProperty, createReservation, getCurrentUser } from '../../data/api';
import { parseActivePathname } from '../../routes/url-parser';

export default class ReservationDetailPage {
    constructor() {
        this.property = null;
        this.propertyId = null;
    }

    async render() {
        return `
            <section class="container">
                <div class="reservation-process">
                    <div class="header-container row valign-wrapper">
                        <a class="col back" href="#/home"><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
                        <h1 class="col reservation-detail-title">Reservation Process</h1>
                    </div>

                    <div id="property-content">
                        <div class="center-align" style="padding: 40px;">
                            <p style="color: #7164B1;">Loading property details...</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        const body = document.querySelector('body');
        body.style.backgroundColor = '#292345';

        // Get property ID from URL
        const urlSegments = parseActivePathname();
        this.propertyId = urlSegments.id;

        if (this.propertyId) {
            await this.loadProperty();
        } else {
            this.displayError('Property ID not found');
        }
    }

    async loadProperty() {
        try {
            console.log(`Loading property with ID: ${this.propertyId}`);
            const propertyResult = await getProperty(this.propertyId);

            if (propertyResult.success) {
                this.property = propertyResult.property;
                console.log('Property loaded:', this.property);
                this.displayProperty();
                this.setupEventListeners();
            } else {
                console.error('Failed to load property:', propertyResult.error);
                this.displayError(propertyResult.error || 'Property not found');
            }
        } catch (error) {
            console.error('Error loading property:', error);
            this.displayError('Error loading property details');
        }
    }

    displayProperty() {
        const contentContainer = document.querySelector('#property-content');

        // Handle different property structure from API - use prop_id instead of id
        const propertyName = this.property.name || this.property.title || `Property ${this.property.prop_id}`;
        const propertyLocation = this.property.location || 'Location not specified';
        const propertySize = this.property.size || 'Size not specified';
        const propertyDescription = this.property.description || 'No description available';
        const propertyImage = this.property.image || 'images/default-property.jpg';
        const propertyPrice = this.property.price || 0;

        // Handle price - it might be a string from API, so convert to number
        const numericPrice = typeof propertyPrice === 'string' ? parseFloat(propertyPrice) || 0 : propertyPrice;
        const formattedPrice = new Intl.NumberFormat('id-ID').format(numericPrice);

        contentContainer.innerHTML = `
            <div class="property-header">
                <h2 style="color: white; margin-bottom: 20px;">${propertyName}</h2>
            </div>

            <div class="description-section">
                <h3>Description</h3>
                <div class="property-details">
                    <div class="detail-item">
                        <strong class="detail-bold">Location:</strong> ${propertyLocation}
                    </div>
                    <div class="detail-item">
                        <strong class="detail-bold">Size:</strong> ${propertySize}
                    </div>
                    <div class="detail-item">
                        <strong class="detail-bold">Price:</strong> Rp ${formattedPrice} / day
                    </div>
                    <div class="detail-item">
                        <strong class="detail-bold">Room Description:</strong> ${propertyDescription}
                    </div>
                </div>
            </div>

            <div class="property-image-section">
                <h3>Property Image</h3>
                <div class="image-container">
                    <img src="${propertyImage}" 
                         alt="${propertyName} Interior" 
                         style="width: 100%; border-radius: 8px; max-height: 300px; object-fit: cover;" 
                         onerror="this.src='images/default-property.jpg'; this.onerror=null;" />
                </div>
            </div>
            
            <form class="date-selection" id="reservation-form">
                <h3>Pick Date To Use</h3>
                <div class="date-inputs">
                    <input type="date" id="start-date" placeholder="Start Date" required />
                    <input type="date" id="end-date" placeholder="End Date" required />
                </div>
                <div id="date-error" style="color: #D45656; font-size: 14px; margin-top: 10px; display: none;"></div>
            </form>

            <div class="payment-summary">
                <h3>Total Payment</h3>
                <div class="payment-details">
                    <div class="payment-row">
                        <span>Total Days of Use:</span>
                        <span id="total-days">-</span>
                    </div>
                    <div class="payment-row">
                        <span>Price per Day:</span>
                        <span>Rp ${formattedPrice}</span>
                    </div>
                    <hr />
                    <div class="payment-row total">
                        <span>Total Price:</span>
                        <span id="total-price">Rp 0</span>
                    </div>
                    <div class="tax-note">*Price included Tax</div>
                </div>
            </div>
             
            <div class="container center-align">
                <button type="submit" form="reservation-form" class="process-reservation-btn row s10" id="process-btn">
                    Process Reservation
                </button>
            </div>
        `;
    }

    displayError(message) {
        const contentContainer = document.querySelector('#property-content');
        contentContainer.innerHTML = `
            <div class="center-align" style="padding: 40px;">
                <p style="color: #D45656; font-size: 16px;">${message}</p>
                <button onclick="window.location.hash = '#/home'" style="background: #7164B1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin-top: 20px;">
                    Back to Home
                </button>
            </div>
        `;
    }

    setupEventListeners() {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const form = document.getElementById('reservation-form');

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        startDateInput.min = today;
        endDateInput.min = today;

        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', () => {
                endDateInput.min = startDateInput.value;
                this.calculateTotal();
            });
            endDateInput.addEventListener('change', () => this.calculateTotal());
        }

        if (form) {
            form.addEventListener('submit', (e) => this.handleReservation(e));
        }
    }

    calculateTotal() {
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const totalDaysSpan = document.getElementById('total-days');
        const totalPriceSpan = document.getElementById('total-price');
        const errorDiv = document.getElementById('date-error');

        if (!startDateInput.value || !endDateInput.value) {
            totalDaysSpan.textContent = '-';
            totalPriceSpan.textContent = 'Rp 0';
            errorDiv.style.display = 'none';
            return;
        }

        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (endDate <= startDate) {
            errorDiv.textContent = 'End date must be after start date';
            errorDiv.style.display = 'block';
            totalDaysSpan.textContent = '-';
            totalPriceSpan.textContent = 'Rp 0';
            return;
        }

        errorDiv.style.display = 'none';
        const timeDiff = endDate.getTime() - startDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Handle price - it might be a string from API, so convert to number
        const numericPrice = typeof this.property.price === 'string' ? parseFloat(this.property.price) || 0 : this.property.price;
        const totalPrice = daysDiff * numericPrice;

        totalDaysSpan.textContent = daysDiff.toString();
        totalPriceSpan.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(totalPrice)}`;
    }

    async handleReservation(e) {
        e.preventDefault();

        const processBtn = document.getElementById('process-btn');
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const errorDiv = document.getElementById('date-error');

        if (!startDate || !endDate) {
            errorDiv.textContent = 'Please select both start and end dates';
            errorDiv.style.display = 'block';
            return;
        }

        // Check if user is logged in
        const user = getCurrentUser();
        console.log(user);
        if (!user) {
            alert('Please log in to make a reservation');
            window.location.hash = '#/login';
            return;
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start < today) {
            errorDiv.textContent = 'Start date cannot be in the past';
            errorDiv.style.display = 'block';
            return;
        }

        if (end <= start) {
            errorDiv.textContent = 'End date must be after start date';
            errorDiv.style.display = 'block';
            return;
        }

        // Calculate total
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));

        // Handle price - it might be a string from API, so convert to number
        const numericPrice = typeof this.property.price === 'string' ? parseFloat(this.property.price) || 0 : this.property.price;
        const totalPrice = totalDays * numericPrice;

        // Disable button and show loading
        processBtn.disabled = true;
        processBtn.textContent = 'Processing...';
        errorDiv.style.display = 'none';

        const username = user.username;
        try {
            console.log('Creating reservation:', {
                username,
                startDate,
                endDate,
            });

            console.log("property id is :", this.property.id);
            console.log('start date is ', startDate);
            console.log('end date is ', endDate);
            const result = await createReservation(
                this.property.prop_id,
                username,
                startDate,
                endDate,
            );

            console.log('Reservation result:', result);

            if (result.success) {
                alert('Reservation created successfully!');
                // Navigate to reservations list to see the new reservation
                window.location.hash = '#/reservationslist';
            } else {
                errorDiv.textContent = result.message || result.error || 'Failed to create reservation';
                errorDiv.style.display = 'block';
                console.error('Reservation failed:', result);
            }
        } catch (error) {
            console.error('Reservation error:', error);
            errorDiv.textContent = 'Failed to create reservation. Please try again.';
            errorDiv.style.display = 'block';
        } finally {
            processBtn.disabled = false;
            processBtn.textContent = 'Process Reservation';
        }
    }
}