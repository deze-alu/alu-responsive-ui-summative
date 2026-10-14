import { Expense } from '../../lib/expense.js'
import { injectHTMLTemplate } from '../../lib/html.js'
import {
	BooksSvg,
	TransportSvg,
	OthersSvg,
	FoodSvg,
	EnterainmentSvg,
	MoneySvg,
} from '../../lib/svg.js'

class TransactionsTable extends HTMLElement {
	constructor() {
		super()

		this.expenses = new Expense().getExpenses()
		this.sortDirection = 'descending'
		this.sortKey = 'date'
		this.sortType = 'date'
		this.moneyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
	}

	async connectedCallback() {
		await injectHTMLTemplate('transactions-table.html', this)
		this.renderTable()
	}

	renderTable() {
		const body = this.querySelector('[data-table-body]')
		console.log(this.expenses)
		const rows = this.expenses
			.sort((a, z) => this.sortTable(a, z))
			.map((expense) => this.createTableRow(expense))

		body.replaceChildren(...rows)
	}

	sortTable(a, z) {
		const valueA = a[this.sortKey]
		const valueZ = z[this.sortKey]

		let result

		if (this.sortType === 'number') {
			result = Number(valueA) - Number(valueZ)
		} else if (this.sortType === 'date') {
			result = valueA.localeCompare(valueZ)
		} else {
			result = valueA.localeCompare(valueZ, undefined, { sensitivity: 'base', numeric: true })
		}

		return this.sortDirection === 'ascending' ? result : -result
	}

	createElement(htmlTag, className, text) {
		const element = document.createElement(htmlTag)
		if (className) element.className = className
		if (text) element.textContent = text

		return element
	}

	createTableRow(expense) {
		const row = document.createElement('tr')

		const idCell = this.createElement('td', '', expense.id.toUpperCase())

		const descriptionCell = document.createElement('td')
		const transaction = this.createElement('div', 'transaction')

		const icon = this.createElement('span', 'transaction__icon')
		icon.setAttribute('aria-hidden', 'true')
		icon.innerHTML = this.getIcon(expense.category.toLowerCase())

		const description = this.createElement('p', 'transaction__name', expense.description || 'N/A')

		transaction.append(icon, description)
		descriptionCell.append(transaction)

		const dateCell = this.createElement('td', 'table__muted')
		const date = document.createElement('span')
		date.textContent = expense.date

		dateCell.append(date)

		const categoryCell = document.createElement('td')
		categoryCell.append(this.createElement('span', 'category-tag', expense.category))

		const amountCell = this.createElement(
			'td',
			'table__num amount',
			`${this.moneyFormat.format(Number(expense.amount))}`
		)

		row.append(idCell, descriptionCell, categoryCell, amountCell, dateCell)

		return row
	}

	getIcon(category) {
		switch (category) {
			case 'books':
				return BooksSvg()

			case 'entertainment':
				return EnterainmentSvg()

			case 'transport':
				return TransportSvg()

			case 'food':
				return FoodSvg()

			case 'fees':
				return MoneySvg()

			case 'other':
				return OthersSvg()

			default:
				return OthersSvg()
		}
	}
}

customElements.define('transactions-table', TransactionsTable)
