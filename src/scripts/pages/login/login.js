import { login } from '../../data/api'

export default class LoginPage {
    async render(){
        return `
        <!-- Sign Up Input Form -->
        <div class="login valign-wrapper">
            <div class="container center-align">
                <form id="login-form">
                    <h1 class="auth-title center-align"><span>Log In</span></h1>

                    <!-- Inputs -->
                    <div class="container input-box">
                        <input placeholder="Email" id="email" type="text" required>
                    </div>
                    <div class="container input-box">
                        <input placeholder="Password" id="password" type="password" required>
                    </div>
            
                    <!-- Button -->
                    <div class="container sign-in">
                        <button type="submit" class="waves-effect waves-light btn submit">Get In</button>
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
        const body= document.querySelector('body');
        body.style.backgroundColor='#292345';

        await this.verifyLogin();
    }

    async verifyLogin(){
        const form = document.querySelector('#login-form');

        form.addEventListener('submit', async e => {
            e.preventDefault();

            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await login(email, password);

                if (response) {
                    console.log("Login berhasil");
                    //TODO
                    window.location.hash = '#/home';
                }
                else {
                    console.log("Login gagal");
                }
            }
            catch (error) {
                throw new Error(error);
            }
        })
    }

}