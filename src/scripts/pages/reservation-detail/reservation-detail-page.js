export default class ReservationDetailPage {
    async render() {
    // Mock data - in real implementation this would come from API
    const propertyData = {
        "id": "1",
        "Location": "Jl. Kuningan Nomor 23, Jakarta Barat",
        "Size": "Studio Room (20 meter persegi)",
        "Price": "450.000",
        "Room Description": "1 small bedroom with toilet and balcony",
        "Photo": "property-image.jpg"
    };

        return `
            <section class="container">
                <div class="reservation-process">
                    <div class="header-container row valign-wrapper">
                        <a class="col back" href=""><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
                        <h1 class="col reservation-detail-title">Reservation Process</h1>
                    </div>

                    <div class="description-section">
                        <h3>Description</h3>
                        <div class="property-details">
                            <div class="detail-item">
                                <strong class="detail-bold">Location:</strong> ${propertyData.Location}
                            </div>
                            <div class="detail-item">
                                <strong class="detail-bold">Size:</strong> ${propertyData.Size}
                            </div>
                            <div class="detail-item">
                                <strong class="detail-bold">Price:</strong> Rp ${propertyData.Price} / day
                            </div>
                            <div class="detail-item">
                                <strong class="detail-bold">Room Description:</strong> ${propertyData["Room Description"]}
                            </div>
                        </div>
                    <div class="property-image-section">
                        <h3>Property Image</h3>
                        <div class="image-container">
                            <img src="${propertyData.Photo}" alt="Kuningan Apartment Interior" />
                        </div>
                    </div>
                    
                    <form class="date-selection">
                        <h3>Pick Date To Use</h3>
                        <div class="date-inputs">
                            <input type="date" id="start-date" placeholder="Start Date" />
                            <input type="date" id="end-date" placeholder="End Date" />
                        </div>
                    </form>

                    <div class="payment-summary">
                        <h3>Total Payment</h3>
                        <div class="payment-details">
                            <div class="payment-row">
                                <span>Total Days of Use:</span>
                                <span id="total-days"></span>
                            </div>
                            <div class="payment-row">
                                <span>Price per Day:</span>
                                <span>${propertyData.Price}</span>
                            </div>
                            <hr />
                            <div class="payment-row total">
                                <span>Total Price:</span>
                                <span id="total-price">900.000</span>
                            </div>
                            <div class="tax-note">*Price included Tax</div>
                        </div>
                    </div>
                     
                    <div class="container center-align">
                        <button class="process-reservation-btn row s10">Process Reservation</button>
                    </div>
                </div>
            </section>
        `;
    }

    async afterRender() {
        // Mock data - in real implementation this would come from API
        const propertyData = {
            "id": "1",
            "Location": "Jl. Kuningan Nomor 23, Jakarta Barat",
            "Size": "Studio Room (20 meter persegi)",
            "Price": "450.000",
            "Room Description": "1 small bedroom with toilet and balcony",
            "Photo": "property-image.jpg"
        };

        // BODY Background Color
        const body = document.querySelector('body');
        body.style.backgroundColor = '#292345';

        // Calculate price and total date
        this.calculateTotal(propertyData);

        // Handle reservation button click
        const reservationBtn = document.querySelector('.process-reservation-btn');
        if (reservationBtn) {
            reservationBtn.addEventListener('click', () => {
                // Handle reservation process
                console.log('Processing reservation...');
            });
        }

    }

    calculateTotal(propertyData) {
        // Calculate total days and price when dates change
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const totalDaysSpan = document.getElementById('total-days');
        const totalPriceSpan = document.getElementById('total-price');
        const pricePerDay = propertyData.Price;

        function calculateTotal() {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);

            if (startDate && endDate && endDate > startDate) {
                const timeDiff = endDate.getTime() - startDate.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                const totalPrice = daysDiff * pricePerDay;

                totalDaysSpan.textContent = daysDiff.toString();
                totalPriceSpan.textContent = totalPrice.toLocaleString();
            }
        }

        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', calculateTotal);
            endDateInput.addEventListener('change', calculateTotal);
        }
    }
}