import { signup, getCurrentUser } from '../../data/api';

export default class SignUpPage {
    async render(){
        return `
        <div class="valign-wrapper">
            <div class="container center-align">
                <form id="signup-form">
                    <h1 class="auth-title center-align"><span>Sign Up</span></h1>

                    <!-- Error/Success message -->
                    <div id="message-container" class="container" style="display: none; margin-bottom: 15px; padding: 10px; border-radius: 8px;">
                    </div>

                    <!-- Inputs -->
                    <div class="container input-box">
                        <input placeholder="Username" id="username" name="username" type="text" required>
                    </div>
                    <div class="container input-box">
                        <input placeholder="Email" id="email" type="email" required>
                    </div>
                    <div class="container input-box">
                        <input placeholder="Password" id="password" type="password" required minlength="6">
                    </div>
                    <div class="container input-box">
                        <input placeholder="Confirm Password" id="confirmpassword" name="confirmpassword" type="password" required>
                    </div>
            
                    <!-- Button -->
                    <div class="container sign-in">
                        <button type="submit" class="waves-effect waves-light btn submit" id="signup-btn">Join</button>
                    </div>
                    <div class="container description">
                        <p class="signup-p">Have an account? <a class="signup-button class" href="#/login">Log In</a></p>
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

        await this.handleSignUp();
    }

    showMessage(message, isError = false) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';

        if (isError) {
            messageContainer.style.backgroundColor = 'rgba(212, 86, 86, 0.2)';
            messageContainer.style.color = '#D45656';
        } else {
            messageContainer.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
            messageContainer.style.color = '#4CAF50';
        }
    }

    async handleSignUp() {
        const form = document.querySelector('#signup-form');
        const signupBtn = document.getElementById('signup-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Clear previous messages
            document.getElementById('message-container').style.display = 'none';

            const username = document.querySelector('#username').value.trim();
            const email = document.querySelector('#email').value.trim();
            const password = document.querySelector('#password').value;
            const confirmPassword = document.querySelector('#confirmpassword').value;

            // Validation
            if (!username || !email || !password || !confirmPassword) {
                this.showMessage('Please fill in all fields', true);
                return;
            }

            if (password.length < 6) {
                this.showMessage('Password must be at least 6 characters long', true);
                return;
            }

            if (password !== confirmPassword) {
                this.showMessage('Passwords do not match', true);
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                this.showMessage('Please enter a valid email address', true);
                return;
            }

            // Disable button and show loading
            signupBtn.disabled = true;
            signupBtn.textContent = 'Creating Account...';

            try {
                const response = await signup(username, email, password);

                if (response.success) {
                    this.showMessage('Account created successfully! Redirecting to login...', false);
                    signupBtn.textContent = 'Success!';

                    // Redirect to login after 2 seconds
                    setTimeout(() => {
                        window.location.hash = '#/login';
                    }, 2000);
                } else {
                    this.showMessage(response.message || 'Signup failed. Please try again.', true);
                }
            } catch (error) {
                console.error('Signup error:', error);
                this.showMessage('Signup failed. Please try again.', true);
            } finally {
                if (signupBtn.textContent !== 'Success!') {
                    signupBtn.disabled = false;
                    signupBtn.textContent = 'Join';
                }
            }
        });
    }
}