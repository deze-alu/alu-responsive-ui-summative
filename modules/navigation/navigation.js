import { injectHTMLTemplate } from '../../lib/html.js'

class SiteNavigation extends HTMLElement {
	async connectedCallback() {
		await injectHTMLTemplate('navigation.html', this)

		this.setActiveTab()
		this.setupEvents()
	}

	setActiveTab() {
		const activeTab = this.getAttribute('active')
		const links = this.querySelectorAll('[data-tab]')

		links.forEach((link) => {
			const isActive = link.dataset.tab === activeTab
			link.classList.toggle('active', isActive)
		})
	}

	setupEvents() {
		const nav = this.querySelector('[data-navigation]')

		if (!nav) {
			console.error('Navigation element not found in component HTML.')
			return
		}

		nav.addEventListener('click', (event) => {
			const link = event.target.closest('[data-tab]')

			if (!link || !nav.contains(link)) return
			console.log('Clicked tab:', link.dataset.tab)
		})
	}
}

customElements.define('site-navigation', SiteNavigation)
