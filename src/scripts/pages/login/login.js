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
                        <input placeholder="Email" id="email" type="email" required>
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
        const user = await getCurrentUser();
        if (user) {
            window.location.hash = '#/home';
            return;
        }

        await this.setupLogin();
    }

    async setupLogin(){
        const form = document.querySelector('#login-form');
        const errorDiv = document.getElementById('error-message');
        const loginBtn = document.getElementById('login-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous errors
            errorDiv.style.display = 'none';

            // Get form data
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Validate input
            if (!email || !password) {
                this.showError('Please fill in all fields');
                return;
            }

            // Disable button and show loading
            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';

            try {
                const result = await login(email, password);

                if (result.success) {
                    console.log("Login successful");
                    // Small delay to show success
                    loginBtn.textContent = 'Success!';
                    setTimeout(() => {
                        window.location.hash = '#/home';
                    }, 500);
                } else {
                    this.showError(result.message || 'Invalid email or password');
                }
            } catch (error) {
                console.error('Login error:', error);
                this.showError('Login failed. Please try again.');
            } finally {
                if (loginBtn.textContent !== 'Success!') {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Get In';
                }
            }
        });
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}