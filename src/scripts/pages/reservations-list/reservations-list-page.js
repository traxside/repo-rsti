import { getUserReservations, getCurrentUser } from '../../data/api';

export default class ReservationsListPage {
    constructor() {
        this.reservations = [];
        this.user = null;
    }

    async render() {
        return `
        <div class="container row center-align header-reservation">
            <a class="col back" href="#/profile"><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
            <div class="reserve title two">Reservations List</div>
        </div>  
        
        <section class="container reservation-list-container">
            <div id="reservations-content">
                <div class="center-align" style="padding: 40px;">
                    <p style="color: #7164B1;">Loading reservations...</p>
                </div>
            </div>
        </section>
        `;
    }

    async afterRender() {
        const body = document.querySelector('body');
        body.style.backgroundColor = 'white';

        // Check if user is logged in
        this.user = await getCurrentUser();
        if (!this.user) {
            this.displayLoginRequired();
            return;
        }

        await this.loadReservations();
    }

    async loadReservations() {
        try {
            console.log('Loading user reservations...');
            this.reservations = await getUserReservations();

            console.log('Reservations loaded:', this.reservations);
            this.displayReservations();
        } catch (error) {
            console.log('Reservations list', this.reservations);
            console.error('Error loading reservations:', error);
            this.displayError('Error loading reservations. Please try again.');
        }
    }

    displayReservations() {
        const contentContainer = document.querySelector('#reservations-content');

        if (!this.reservations || this.reservations.length === 0) {
            contentContainer.innerHTML = `
            <div class="center-align" style="padding: 40px;">
                <p style="color: #7164B1;">No reservations found</p>
                <a href="#/home" class="waves-effect waves-light btn" style="margin-top: 20px;">
                    Browse Properties
                </a>
            </div>
        `;
            return;
        }

        // Sort reservations by status (active first) and then by date
        const sortedReservations = this.reservations.sort((a, b) => {
            // Get status from reservation data
            const statusA = this.getReservationStatus(a);
            const statusB = this.getReservationStatus(b);

            if (statusA === 'active' && statusB !== 'active') return -1;
            if (statusB === 'active' && statusA !== 'active') return 1;

            // Sort by created date if available, otherwise by start date
            const dateA = new Date(a.created_at || a.start_date || a.startDate);
            const dateB = new Date(b.created_at || b.start_date || b.startDate);
            return dateB - dateA;
        });

        contentContainer.innerHTML = sortedReservations
            .map(reservation => this.createReservationCard(reservation))
            .join('');

        // Add click handlers for all reservations
        sortedReservations.forEach(reservation => {
            // Get the property ID - check different possible field names
            const propertyId = reservation.property_id || reservation.propertyId || reservation.order_id || reservation.id;
            console.log('Processing reservation:', reservation);
            console.log('Property ID found:', propertyId);

            if (propertyId) {
                const card = document.querySelector(`[data-order-id="${propertyId}"]`);
                console.log('Found card element:', card);

                if (card) {
                    card.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log('Card clicked! Navigating to get key for order:', propertyId);
                        window.location.hash = `#/getkeylist/${propertyId}`;
                    });
                } else {
                    console.error('Card not found for property ID:', propertyId);
                }
            } else {
                console.error('No property ID found in reservation:', reservation);
            }
        });
    }

    createReservationCard(reservation) {
        // Handle different possible field names from backend
        const startDate = new Date(reservation.start_date || reservation.startDate || reservation.check_in_date);
        const endDate = new Date(reservation.end_date || reservation.endDate || reservation.check_out_date);
        const propertyName = reservation.property_name || reservation.propertyName || reservation.property || 'Property';
        const totalPrice = reservation.total_price || reservation.totalPrice || reservation.price || 0;

        // Get the property ID - check different possible field names
        const orderId = reservation.property_id || reservation.propertyId || reservation.order_id || reservation.id;

        // Calculate days between dates
        const timeDifference = endDate.getTime() - startDate.getTime();
        const totalDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

        const formattedStartDate = startDate.toLocaleDateString('en-GB');
        const formattedEndDate = endDate.toLocaleDateString('en-GB');
        const formattedPrice = new Intl.NumberFormat('id-ID').format(totalPrice);

        // Determine status styling and actions
        const status = this.getReservationStatus(reservation);
        const statusInfo = this.getStatusInfo(status);

        // Make all cards clickable
        const isClickable = true;

        return `
        <div class="container">
            <div class="card-panel property white-text ${isClickable ? 'clickable-card' : ''}" 
                 data-order-id="${orderId}"
                 style="cursor: pointer; position: relative;">
                
                <div class="reservation-status-badge" style="
                    position: absolute; 
                    top: 10px; 
                    right: 10px; 
                    padding: 4px 8px; 
                    border-radius: 12px; 
                    font-size: 12px; 
                    font-weight: bold;
                    background-color: ${statusInfo.color};
                    color: white;
                ">
                    ${statusInfo.label}
                </div>

                <div class="property-detail">
                    <div class="property-title">${propertyName}</div>
                    <div class="property-desc">${formattedStartDate} - ${formattedEndDate}</div>
                    <div class="property-desc" style="margin-top: 5px; font-size: 14px; color: #666;">
                        ${totalDays} day${totalDays > 1 ? 's' : ''} • Rp ${formattedPrice}
                    </div>
                    <div class="property-desc" style="margin-top: 8px; color: #4CAF50; font-weight: 500;">
                        Tap to access property
                    </div>
                </div>
            </div>
        </div>
    `;
    }

    getReservationStatus(reservation) {
        // Check if status is explicitly set
        if (reservation.status) {
            return reservation.status.toLowerCase();
        }

        // Determine status based on dates if no explicit status
        const now = new Date();
        const startDate = new Date(reservation.start_date || reservation.startDate || reservation.check_in_date);
        const endDate = new Date(reservation.end_date || reservation.endDate || reservation.check_out_date);

        if (now < startDate) {
            return 'pending'; // Future reservation
        } else if (now >= startDate && now <= endDate) {
            return 'active'; // Currently ongoing
        } else {
            return 'completed'; // Past reservation
        }
    }

    getStatusInfo(status) {
        switch (status) {
            case 'active':
                return { label: 'Active', color: '#4CAF50' };
            case 'completed':
                return { label: 'Completed', color: '#9E9E9E' };
            case 'pending':
                return { label: 'Pending', color: '#FF9800' };
            case 'cancelled':
                return { label: 'Cancelled', color: '#F44336' };
            default:
                return { label: 'Unknown', color: '#9E9E9E' };
        }
    }

    displayLoginRequired() {
        const contentContainer = document.querySelector('#reservations-content');
        contentContainer.innerHTML = `
            <div class="center-align" style="padding: 40px;">
                <p style="color: #D45656; font-size: 16px;">Please log in to view your reservations</p>
                <a href="#/login" class="waves-effect waves-light btn" style="margin-top: 20px;">
                    Login
                </a>
            </div>
        `;
    }

    displayError(message) {
        const contentContainer = document.querySelector('#reservations-content');
        contentContainer.innerHTML = `
            <div class="center-align" style="padding: 40px;">
                <p style="color: #D45656; font-size: 16px;">${message}</p>
                <button onclick="location.reload()" class="waves-effect waves-light btn" style="margin-top: 20px;">
                    Retry
                </button>
            </div>
        `;
    }
}