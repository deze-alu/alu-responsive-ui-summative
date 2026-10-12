
class SiteNavigation extends HTMLElement {
  async connectedCallback() {
    const url = new URL("./navigation.html", import.meta.url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to load navigation: ${response.status} ${response.url}`
        );
      }

      this.innerHTML = await response.text();
      this.setupEvents();
    } catch (error) {
      console.error(error);
    }
  }

  setupEvents() {
    const nav = this.querySelector("[data-navigation]");

    if (!nav) {
      console.error("Navigation element not found in component HTML.");
      return;
    }

    nav.addEventListener("click", () => {
      console.log("Clicked the nav");
    });
  }
}

customElements.define("site-navigation", SiteNavigation);
