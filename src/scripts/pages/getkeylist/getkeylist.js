import { getKey, getUserReservations, checkoutReservation, getCurrentUser } from '../../data/api';

export default class GetKeyListPage {
  constructor() {
    this.currentReservation = null;
    this.accessCode = null;
  }

  async render() {
    return `
        <div class="container row center-align header-reservation">
            <a class="col back" href="#/reservationslist"><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
            <h1 class="reserve title two">Property Access</h1>
        </div>
        <section class="container">
            <div id="reservation-details">
                <!-- Reservation details will be loaded here -->
            </div>
  
            <div class="profile title">Access Code</div>
            
            <div class="card-panel z-depth-0 center-align key-container">
                <!-- Access code will be displayed here -->
            </div>
            
            <div class="profile title">House Rules</div>
            <div class="container rules-element">
                <ol>
                    <li>Check-In Code is used to lock/unlock the property</li>
                    <li>Check-In will be available at 12 PM</li>
                    <li>Check-Out will be available at 11 AM</li>
                    <li>Please note that all furniture and accessories are part of the property and are not complimentary. Kindly do not remove or take any items from the premises</li>
                    <li>Keep the property clean and report any damages immediately</li>
                    <li>No smoking inside the property</li>
                </ol>
            </div>
  
            <div class="container profile" style="margin-top: 30px;">
                <button id="checkout-btn" class="waves-effect waves-light btn white-text" style="width: 100%; margin-bottom: 10px;">
                    Check Out
                </button>
                <button class="waves-effect waves-light btn merah white-text" style="width: 100%;" disabled>
                    Chat - Not Available
                </button>
            </div>
        </section>
        `;
  }

  async afterRender() {
    const body = document.querySelector('body');
    body.style.backgroundColor = 'white';

    // Check if user is logged in
    const user = await getCurrentUser();
    if (!user) {
      window.location.hash = '#/login';
      return;
    }

    await this.loadReservationData();
    await this.displayKey();
    this.setupEventListeners();
  }

  async loadReservationData() {
    try {
      const reservations = await getUserReservations();
      // Get the active reservation
      this.currentReservation = reservations.find(r => r.status === 'active');

      if (this.currentReservation) {
        this.displayReservationDetails();
      } else {
        this.displayNoActiveReservation();
      }
    } catch (error) {
      console.error('Error loading reservation data:', error);
      this.displayError();
    }
  }

  displayReservationDetails() {
    const detailsContainer = document.querySelector('#reservation-details');

    if (!this.currentReservation) return;

    const startDate = new Date(this.currentReservation.startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const endDate = new Date(this.currentReservation.endDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedPrice = new Intl.NumberFormat('id-ID').format(this.currentReservation.totalPrice);

    detailsContainer.innerHTML = `
            <div class="card-panel" style="margin-bottom: 20px;">
                <h5 style="margin-top: 0; color: #292345;">${this.currentReservation.propertyName}</h5>
                <div style="margin-bottom: 10px;">
                    <strong>Check-in:</strong> ${startDate}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Check-out:</strong> ${endDate}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Total Payment:</strong> Rp ${formattedPrice}
                </div>
                <div style="margin-bottom: 10px;">
                    <span class="chip green white-text">Active Reservation</span>
                </div>
            </div>
        `;
  }

  displayNoActiveReservation() {
    const detailsContainer = document.querySelector('#reservation-details');
    detailsContainer.innerHTML = `
            <div class="card-panel center-align" style="margin-bottom: 20px;">
                <h5 style="color: #D45656;">No Active Reservation</h5>
                <p>You don't have any active reservations at the moment.</p>
                <a href="#/home" class="waves-effect waves-light btn">Browse Properties</a>
            </div>
        `;

    // Hide key container and checkout button
    document.querySelector('.key-container').style.display = 'none';
    document.querySelector('#checkout-btn').style.display = 'none';
  }

  displayError() {
    const detailsContainer = document.querySelector('#reservation-details');
    detailsContainer.innerHTML = `
            <div class="card-panel center-align" style="margin-bottom: 20px;">
                <h5 style="color: #D45656;">Error Loading Data</h5>
                <p>There was an error loading your reservation details.</p>
                <button class="waves-effect waves-light btn" onclick="location.reload()">Retry</button>
            </div>
        `;
  }

  async displayKey() {
    const keyContainer = document.querySelector('.key-container');

    if (!this.currentReservation) {
      keyContainer.innerHTML = '<p style="color: #999;">No access code available</p>';
      return;
    }

    try {
      // Show loading
      keyContainer.innerHTML = `
                <div class="preloader-wrapper small active">
                    <div class="spinner-layer spinner-purple-only">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div>
                        <div class="gap-patch">
                            <div class="circle"></div>
                        </div>
                        <div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>
                </div>
            `;

      this.accessCode = await getKey();

      // Display the access code with styling
      keyContainer.innerHTML = `
                <div style="padding: 20px;">
                    <h4 style="color: #292345; margin-bottom: 10px; font-weight: bold; font-size: 2.5rem; letter-spacing: 0.2rem;">
                        ${this.accessCode}
                    </h4>
                    <p style="color: #666; font-size: 0.9rem;">
                        Use this code to access the property
                    </p>
                    <button id="copy-code-btn" class="waves-effect waves-light btn-small" style="margin-top: 10px;">
                        Copy Code
                    </button>
                </div>
            `;

      // Add copy functionality
      document.getElementById('copy-code-btn').addEventListener('click', () => {
        this.copyAccessCode();
      });

    } catch (error) {
      console.error('Error getting access key:', error);
      keyContainer.innerHTML = '<p style="color: #D45656;">Error loading access code</p>';
    }
  }

  copyAccessCode() {
    if (this.accessCode) {
      // Create a temporary input element to copy the text
      const tempInput = document.createElement('input');
      tempInput.value = this.accessCode;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);

      // Show feedback
      this.showMessage('Access code copied to clipboard!');

      // Update button text temporarily
      const copyBtn = document.getElementById('copy-code-btn');
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('green');

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('green');
      }, 2000);
    }
  }

  setupEventListeners() {
    const checkoutBtn = document.getElementById('checkout-btn');

    if (checkoutBtn && this.currentReservation) {
      checkoutBtn.addEventListener('click', () => {
        this.handleCheckout();
      });
    }
  }

  async handleCheckout() {
    if (!this.currentReservation) return;

    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to check out? This will end your current reservation.');

    if (!confirmed) return;

    const checkoutBtn = document.getElementById('checkout-btn');

    try {
      // Show loading
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Checking out...';

      const result = await checkoutReservation(this.currentReservation.id);

      if (result.success) {
        this.showMessage('Checkout successful! Thank you for staying with us.');

        // Update button
        checkoutBtn.textContent = 'Checked Out';
        checkoutBtn.classList.add('green');

        // Update reservation status display
        setTimeout(() => {
          window.location.hash = '#/reservationslist';
        }, 2000);

      } else {
        this.showMessage(result.message || 'Checkout failed. Please try again.', true);
      }

    } catch (error) {
      console.error('Checkout error:', error);
      this.showMessage('Checkout failed. Please try again.', true);
    } finally {
      if (checkoutBtn.textContent === 'Checking out...') {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Check Out';
      }
    }
  }

  showMessage(message, isError = false) {
    // Create a temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 1000;
            text-align: center;
            font-weight: 500;
            ${isError ?
        'background-color: rgba(212, 86, 86, 0.9); color: white;' :
        'background-color: rgba(76, 175, 80, 0.9); color: white;'
    }
        `;
    messageDiv.textContent = message;

    document.body.appendChild(messageDiv);

    // Remove message after 3 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 3000);
  }
}