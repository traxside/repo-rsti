import { getKey, getCurrentUser } from '../../data/api';

export default class GetKeyListPage {
  constructor() {
    this.accessCode = null;
    this.propertyId = null;
  }

  async render() {
    return `
        <div class="container row center-align header-reservation">
            <a class="col back" href="#/reservationslist"><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
            <h1 class="reserve title two">Property Access</h1>
        </div>
        <section class="container">
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

    // Extract property ID from URL
    this.propertyId = this.getPropertyIdFromUrl();
    console.log('Property ID from URL:', this.propertyId);

    if (this.propertyId) {
      await this.displayKey();
    } else {
      this.displayError('No property ID found in URL');
    }
  }

  getPropertyIdFromUrl() {
    // Get the current hash and extract the property ID
    const hash = window.location.hash;
    const match = hash.match(/\/getkeylist\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  async displayKey() {
    const keyContainer = document.querySelector('.key-container');

    if (!this.propertyId) {
      keyContainer.innerHTML = '<p style="color: #999;">No property ID available</p>';
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

      console.log('Getting key for property ID:', this.propertyId);
      const keyResult = await getKey(this.propertyId);

      if (keyResult.success) {
        this.accessCode = keyResult.key;


        // Display the access code with styling
        keyContainer.innerHTML = `
                    <div style="padding: 20px;">
                        <h4 style="color: white; margin-bottom: 10px; font-weight: bold; font-size: 2.5rem; letter-spacing: 0.2rem;">
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
      } else {
        throw new Error(keyResult.error || 'Failed to get access key');
      }

    } catch (error) {
      console.error('Error getting access key:', error);
      keyContainer.innerHTML = `
                <div style="padding: 20px;">
                    <p style="color: #D45656; margin-bottom: 15px;">Error loading access code</p>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${error.message}</p>
                    <button class="waves-effect waves-light btn-small" onclick="location.reload()">
                        Retry
                    </button>
                </div>
            `;
    }
  }

  displayError(message) {
    const keyContainer = document.querySelector('.key-container');
    keyContainer.innerHTML = `
            <div style="padding: 20px;">
                <p style="color: #D45656; margin-bottom: 15px;">${message}</p>
                <a href="#/reservationslist" class="waves-effect waves-light btn">Back to Reservations</a>
            </div>
        `;
  }

  copyAccessCode() {
    if (this.accessCode) {
      // Use modern Clipboard API if available, fallback to execCommand
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(this.accessCode).then(() => {
          this.showCopyFeedback();
        }).catch(() => {
          this.fallbackCopyMethod();
        });
      } else {
        this.fallbackCopyMethod();
      }
    }
  }

  fallbackCopyMethod() {
    // Create a temporary input element to copy the text
    const tempInput = document.createElement('input');
    tempInput.value = this.accessCode;
    document.body.appendChild(tempInput);
    tempInput.select();

    try {
      document.execCommand('copy');
      this.showCopyFeedback();
    } catch (err) {
      console.error('Copy failed:', err);
      this.showMessage('Copy failed. Please copy manually: ' + this.accessCode, true);
    }

    document.body.removeChild(tempInput);
  }

  showCopyFeedback() {
    this.showMessage('Access code copied to clipboard!');

    // Update button text temporarily
    const copyBtn = document.getElementById('copy-code-btn');
    if (copyBtn) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('green');

      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('green');
      }, 2000);
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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