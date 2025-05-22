import { getCurrentUser, logout } from '../../data/api';

export default class ProfilePage {
    constructor() {
        this.currentUser = null;
    }

    async render(){
        return `
        <div class="container">
            <div class="profile title">Your Profile</div>
        </div>
        <div class="container" id="profile-content">
            <!-- Profile content will be loaded here -->
        </div>

        <!-- Button -->
        <div class="container profile">
            <a href="#/reservationslist" class="waves-effect waves-light btn">Reservations List</a>
            <button id="logout-btn" class="waves-effect waves-light btn merah">Log Out</button>
        </div>
        `
    }

    async afterRender(){
        const body = document.querySelector('body');
        body.style.backgroundColor = 'white';

        // Check if user is logged in
        this.currentUser = await getCurrentUser();
        if (!this.currentUser) {
            window.location.hash = '#/login';
            return;
        }

        this.displayUserProfile();
        this.setupEventListeners();
    }

    displayUserProfile() {
        const profileContent = document.querySelector('#profile-content');

        if (!this.currentUser) {
            profileContent.innerHTML = `
                <div class="card-panel profile center-align">
                    <div class="profile-detail" style="color: #D45656;">Error loading profile</div>
                </div>
            `;
            return;
        }

        profileContent.innerHTML = `
            <div class="card-panel profile">
                <div class="profile-detail">
                    <strong>Username:</strong><br>
                    ${this.currentUser.username}
                </div>
            </div>

            <div class="card-panel profile">
                <div class="profile-detail">
                    <strong>Email:</strong><br>
                    ${this.currentUser.email}
                </div>
            </div>

            <div class="card-panel profile">
                <div class="profile-detail">
                    <strong>Password:</strong><br>
                    ****************
                </div>
            </div>

            <div class="card-panel profile">
                <div class="profile-detail">
                    <strong>Account Status:</strong><br>
                    <span class="chip green white-text">Active</span>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');

        logoutBtn.addEventListener('click', () => {
            this.handleLogout();
        });
    }

    async handleLogout() {
        const confirmed = confirm('Are you sure you want to log out?');

        if (!confirmed) return;

        const logoutBtn = document.getElementById('logout-btn');

        try {
            // Show loading
            logoutBtn.disabled = true;
            logoutBtn.textContent = 'Logging out...';

            await logout();

            // Show success message
            this.showMessage('Logged out successfully!');

            // Redirect to login after short delay
            setTimeout(() => {
                window.location.hash = '#/login';
            }, 1000);

        } catch (error) {
            console.error('Logout error:', error);
            this.showMessage('Logout failed. Please try again.', true);

            // Reset button
            logoutBtn.disabled = false;
            logoutBtn.textContent = 'Log Out';
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