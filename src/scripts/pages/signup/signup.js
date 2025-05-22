import { signup } from '../../data/api';

export default class SignUpPage {
    async render(){
        return `
        <div class="valign-wrapper">
            <div class="container center-align">
                <form id="signup-form">
                    <h1 class="auth-title center-align"><span>Sign Up</span></h1>

                    <!-- Inputs -->
                    <div class="container input-box">
                        <input placeholder="Username" id="username" name="username" type="text" required>
                    </div>
                    <div class="container input-box">
                        <input placeholder="Email" id="email" type="text" required>
                    </div>
                    <div class="container input-box">
                        <input placeholder="Password" id="password" type="password" required>
                    </div>
                    <div class="container input-box">
                        <input placeholder="Confirm Password" id="confirmpassword" name="confirmpassword" type="password" required>
                    </div>
            
                    <!-- Button -->
                    <div class="container sign-in">
                        <button type="submit" class="waves-effect waves-light btn submit">Join</button>
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
        //TODO IN PROGRESS
        const body= document.querySelector('body');
        body.style.backgroundColor='#292345';

        await this.handleSignUp();
    }

    async handleSignUp() {
        const form = document.querySelector('#signup-form');

        form.addEventListener('submit',async (e) => {
            e.preventDefault();
            const username = document.querySelector('#username').value;
            const email = document.querySelector('#email').value;
            const password = document.querySelector('#password').value;

            try {
                const response = await signup(username, email, password);

                if (response) {
                    console.log('Signup successful!');
                    window.location.hash = '#/login';
                }
                else {
                    console.log('Signup failed!');
                }
            }
            catch(error) {
                console.error(error);
            }

        });


    }
}