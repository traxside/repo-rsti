export default class LoginPage {
    async render(){
        return `
        <!-- Sign Up Input Form -->
        <div class="login valign-wrapper">
            <div class="container center-align">
                <form id="signup-form">
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
    }
}