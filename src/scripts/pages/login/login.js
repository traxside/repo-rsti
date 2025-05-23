import { login, getCurrentUser } from '../../data/api'

export default class LoginPage {
    async render(){
        return `
        <!-- Sign Up Input Form -->
        <div class="login valign-wrapper">
            <div class="container center-align">
                <form id="login-form">
                    <h1 class="auth-title center-align"><span>Log In</span></h1>

                    <!-- Error message -->
                    <div id="error-message" class="container" style="display: none; margin-bottom: 15px; padding: 10px; background-color: rgba(212, 86, 86, 0.2); border-radius: 8px; color: #D45656;">
                    </div>

                    <!-- Inputs -->
                    <div class="container input-box">
                        <input placeholder="Username" id="username" type="text" required>
                    </div>
                    <div class="container input-box">
                        <input placeholder="Password" id="password" type="password" required>
                    </div>
            
                    <!-- Button -->
                    <div class="container sign-in">
                        <button type="submit" class="waves-effect waves-light btn submit" id="login-btn">Get In</button>
                    </div>
                    <div class="container description">
                        <p class="signup-p">Don't Have an account? <a class="signup-button class" href="#/signup">Sign Up</a></p>
                    </div>
                </form>
            </div>
        </div>
        `
    }

    async afterRender(){
        const body = document.querySelector('body');
        body.style.backgroundColor = '#292345';

        // Check if user is already logged in
        const user = getCurrentUser(); // Remove await since it's not async
        if (user) {
            window.location.hash = '#/home';
            return;
        }

        await this.setupLogin();
    }

    async setupLogin() {
        const form = document.querySelector('#login-form');
        const errorDiv = document.getElementById('error-message');
        const loginBtn = document.getElementById('login-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            errorDiv.style.display = 'none';

            // Get form data
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            // Validate input
            if (!username || !password) {
                this.showError('Please fill in all fields');
                return;
            }

            // Disable button and show loading
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';

            try {
                console.log('Attempting login with username:', username, password);
                const result = await login(username, password);
                console.log('Login result:', result);

                if (result.status === 'Success') {
                    console.log("Login successful");

                    // Save username to localStorage (override if already exists)
                    localStorage.setItem('username', username);

                    // Redirect to home
                    window.location.hash = '#/home';
                } else {
                    // Optional: Show error message from API
                    // this.showError(result.error || 'Invalid username or password');
                }
            } catch (error) {
                console.error('Login error:', error);
                // this.showError('Login failed. Please try again.');
            } finally {
                if (loginBtn.textContent !== 'Success!') {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Get In';
                }
            }
        });
    }

    // showError(message) {
    //     const errorDiv = document.getElementById('error-message');
    //     errorDiv.textContent = message;
    //     errorDiv.style.display = 'block';
    // }
}