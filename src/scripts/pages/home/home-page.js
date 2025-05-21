export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
      </section>
      
      <div class="card test-custom-style">
        <div class="card-content">
          <span class="card-title">Test Card</span>
          <p>If this has Materialize card styling AND purple background with red border, both CSS files are working!</p>
        </div>
        <div class="card-action">
          <a href="#" class="btn waves-effect waves-light">Test Button</a>
        </div>
      </div>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
