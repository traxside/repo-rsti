export default class AboutPage {
  async render() {
    return `
        <div class="container">
            <div class="row center-align header-reservation">
                <a class="col back" href="#/home"><img class="icon-detail" src="images/back_arrow_purple.png" alt="back button"></a>
                <h1 class="reserve title two">About SmartLock</h1>
            </div>
            
            <div class="container" style="margin-top: 30px;">
                <div class="card-panel">
                    <h4 style="color: #292345; margin-bottom: 20px;">Smart Property Rental</h4>
                    <p style="line-height: 1.6; margin-bottom: 15px;">
                        SmartLock is an innovative property rental platform that integrates frontend, backend, and IoT technologies 
                        to make property rentals faster, easier, and safer for everyone.
                    </p>
                    <p style="line-height: 1.6; margin-bottom: 15px;">
                        Our platform provides secure digital access codes, seamless reservation management, 
                        and real-time property access without the need for physical keys.
                    </p>
                </div>

                <div class="card-panel">
                    <h5 style="color: #292345; margin-bottom: 15px;">Key Features</h5>
                    <ul style="line-height: 1.8;">
                        <li>🏠 Browse available properties</li>
                        <li>📅 Easy online reservation system</li>
                        <li>🔐 Secure digital access codes</li>
                        <li>📱 Mobile-friendly interface</li>
                        <li>💳 Integrated payment processing</li>
                        <li>🔧 IoT-enabled smart locks</li>
                    </ul>
                </div>

                <div class="card-panel">
                    <h5 style="color: #292345; margin-bottom: 15px;">How It Works</h5>
                    <ol style="line-height: 1.8;">
                        <li>Create an account and browse properties</li>
                        <li>Select your desired dates and make a reservation</li>
                        <li>Receive your unique access code</li>
                        <li>Use the code to unlock the property</li>
                        <li>Enjoy your stay and check out digitally</li>
                    </ol>
                </div>

                <div class="card-panel center-align">
                    <h5 style="color: #292345; margin-bottom: 15px;">Contact Us</h5>
                    <p>Email: support@smartlock.com</p>
                    <p>Phone: +62 123 456 7890</p>
                    <p>Address: Jakarta, Indonesia</p>
                </div>

                <div class="container center-align" style="margin-top: 30px;">
                    <a href="#/home" class="waves-effect waves-light btn">Back to Home</a>
                </div>
            </div>
        </div>
        `;
  }

  async afterRender() {
    const body = document.querySelector('body');
    body.style.backgroundColor = 'white';
  }
}