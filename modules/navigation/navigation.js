
class SiteNavigation extends HTMLElement {
	constructor() {
		super();

	}

	async connectedCallback() {
		const url = new URL("./_navigation.html", import.meta.url);
		const response = await fetch(url);

		const html = await response.text();
		this.innerHTML = html;

		this.setupEvents();
	}

	setupEvents() {
		const nav = this.querySelector('[data-navigation]');

		nav.addEventListener('click', () => console.log("Clicked the nav"))
	}
}

customElements.define('site-navigation', SiteNavigation);
