import { Expense } from '../../lib/expense.js'
import { injectHTMLTemplate } from '../../lib/html.js'

const FILE_IMPORTED_EVENT = 'file-imported'

class FileImport extends HTMLElement {
	constructor() {
		super()

		this.expenseObj = new Expense()
	}

	async connectedCallback() {
		await injectHTMLTemplate('file-import-export.html', this)

		this.setupEvents()
	}

	setupEvents() {
		const fileInput = this.querySelector('[data-file-input]')
		const exportInput = this.querySelector('[data-export-input]')
		const importInput = this.querySelector('[data-import-input]')

		const exceptAttribute = this.getAttribute('except')
		console.log(exceptAttribute)

		if (exceptAttribute == 'export') {
			exportInput.hidden = true
			exportInput.style.display = 'none'
		}

		if (exceptAttribute == 'import') {
			importInput.hidden = true
			importInput.style.display = 'none'
		}

		importInput.addEventListener('click', () => fileInput.click())
		exportInput.addEventListener('click', () => this.expenseObj.exportExpenses())

		fileInput.addEventListener('change', async () => {
			const file = fileInput.files[0]

			console.log('Json file', file)

			if (!file) return

			try {
				await this.expenseObj.importExpenses(file)
				this.expenses = this.expenseObj.getExpenses()

				window.dispatchEvent(new CustomEvent(FILE_IMPORTED_EVENT))
			} catch (error) {
				console.error('Failed to import expenses: ', error)
			} finally {
				fileInput.value = ''
			}
		})
	}
}

customElements.define('file-import-export', FileImport)

export { FILE_IMPORTED_EVENT }
