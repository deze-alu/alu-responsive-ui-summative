import { Expense } from '../../lib/expense.js'
import { injectHTMLTemplate } from '../../lib/html.js'

class TransactionsTable extends HTMLElement {
	constructor() {
		super()

		this.expense = new Expense()
	}

	async connectedCallback() {
		await injectHTMLTemplate('transactions-table.html', this)
	}
}

customElements.define('transactions-table', TransactionsTable)
