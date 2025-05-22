export default class ProfilePage {
    async render(){
        return `
        <div class="container">
            <div class="profile title">Your Profile</div>
        </div>
        <div class="container">
            <div class="card-panel profile">
                <div class="profile-detail">Richie Leonardo</div>
            </div>

            <div class="card-panel profile">
                <div class="profile-detail">richieleonardo@email.com</div>
            </div>

            <div class="card-panel profile">
                <div class="profile-detail">****************</div>
            </div>
        </div>

        <!-- Button -->
        <div class="container profile">
            <a href="#/reservationslist" class="waves-effect waves-light btn">Reservations List</a>
            <a href="#/login" class="waves-effect waves-light btn merah">Log Out</a>
        </div>

        <!-- Bottom Navigation -->
        <div class="bottom-nav">
            <div class="nav-wrapper">
                <ul class="center-align">
                    <li class="col s6">
                        <a href="unitselection.html" class="container icon">
                            <i class="material-icons">business</i>
                            <span>Reserve</span>
                        </a>
                    </li>
                    <li class="col s6">
                        <a class="container icon active">
                            <i class="material-icons">person</i>
                            <span>Profile</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        `
    }

    async afterRender(){

    }
}