class Navbar {

  // Constructor
  constructor() {
    this.btnOpen = document.getElementById('nav_btnOpenDropdown');
    this.dropdownContainer = document.getElementById('nav_dropdownContainer');
    this.pageBlocker = document.getElementById('nav_pageBlocker');
    this.hasTransition = false;
    this.closeBound = this.close.bind(this);
    this.openBound = this.open.bind(this);
    this.btnOpen.addEventListener('click', this.openBound);
    this.pageBlocker.addEventListener('click', this.closeBound);
    this.highlightCurrentPage();
  }
    
  // Opens the dropdown navigation menu
  open() {
    if (!this.hasTransition) {
      this.dropdownContainer.classList.add("has-transition");
      this.hasTransition = true;
    }
    this.dropdownContainer.classList.add("is-open");
    this.btnOpen.classList.add("is-open");
    window.addEventListener('scroll', this.closeBound);
  }

  // Closes the dropdown navigation menu
  close() {
    this.dropdownContainer.classList.remove("is-open");
    this.btnOpen.classList.remove("is-open");
    window.removeEventListener('scroll', this.closeBound);
  }

  // Gives the selected navigation items a different style
  highlightCurrentPage() {
    const currentPage = window.location.pathname;
    const currentPageSelector = `.navbar [href="${currentPage}"], .dropdown__container [href="${currentPage}"]`;
    const selectedPageLinks = document.querySelectorAll(currentPageSelector);
    selectedPageLinks.forEach(link => {
      link.classList.add("is-selected");
    });
  }

}
  
// Initialize the navbar
const navbar = new Navbar();