export default class ProfilePage {
    async render(){
        return `
        <div class="container valign-wrapper">
          <h1 id="profile-title"">Your Profile</h1>
          <div class="profile-container"></div>
          </div>
          <div class="button-container">
            <a>Reservation List</a>
            <a>Log Out</a>
          </div>
        </div>
        `
    }

    async afterRender(){
        this._fillProfileContainer();
    }

    _fillProfileContainer(user){
        return `
          <div id=user-name class=card-panel>${user.name}</div>
          <div id=user-email class=card-panel>${user.email}</div>
          <div id=user-password class=card-panel>${user.password}</div>
          
        `;
    }
}