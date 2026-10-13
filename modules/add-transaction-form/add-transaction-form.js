import { Expense } from '../../lib/expense.js'
import { injectHTMLTemplate } from '../../lib/html.js'

class AddTransactionForm extends HTMLElement {
	constructor() {
		super()
		this.categories = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other']
		this.expense = new Expense()
	}

	async connectedCallback() {
		await injectHTMLTemplate('add-transaction-form.html', this)

		this.renderSelectOptions()
		this.setupEvents()
	}

	renderSelectOptions() {
		const selectField = this.querySelector('[data-select-input]')

		this.categories
			.map((category) => {
				const option = document.createElement('option')
				option.value = category
				option.innerText = category

				return option
			})
			.forEach((option) => {
				selectField.append(option)
			})
	}

	setupEvents() {
		const form = this.querySelector('[data-add-transaction]')
		const amountField = this.querySelector('[data-amount-input]')
		const selectField = this.querySelector('[data-select-input]')
		const dateField = this.querySelector('[data-date-input]')
		const descriptionField = this.querySelector('[data-description-input]')

		// Inputs events
		amountField.addEventListener('input', () => this.handleAmountInputEvent(amountField.value))
		dateField.addEventListener('change', () => this.validateDate(dateField.value))

		// Submit Event
		form.addEventListener('submit', (event) => {
			event.preventDefault()
			const values = {
				amountField: amountField.value,
				dateField: dateField.value,
				selectField: selectField.value,
				descriptionField: descriptionField.value,
			}

			console.log(values)

			this.handleSubmit(values)
		})
	}

	validateAmount(value) {
		const REGEX_AMOUNT = /^(0|[1-9]\d*)(\.\d{1,2})?$/
		const field = this.querySelector('[data-amount-input]')

		if (!value) {
			this.showError(field, 'Enter an amount...')
			return false
		}
		if (!REGEX_AMOUNT.test(value)) {
			this.showError(field, 'Enter a valid amount, like 25.50')
			return false
		}

		if (Number(value) <= 0) {
			this.showError(field, 'The amount must be greater than zero.')
			return false
		}

		this.showError(field, '')
		return true
	}

	validateDate(value) {
		const field = this.querySelector('[data-date-input]')

		if (!value) {
			this.showError(field, 'Select a transaction date')
			return false
		}
		const today = new Date().toLocaleDateString('en-CA')

		if (value > today) {
			this.showError(field, 'Transaction date cannot be in the future')
			return false
		}

		this.showError(field, '')
		return true
	}

	showError(field, message) {
		const fieldError = this.querySelector(`[data-${field.name}-error]`)

		field.classList.toggle('error-field', message)
		fieldError.innerHTML = message
	}

	handleAmountInputEvent(value) {
		this.validateAmount(value)
	}

	handleSubmit(formValues) {
		const isAmountValid = this.validateAmount(formValues.amountField)
		const isDateValid = this.validateDate(formValues.dateField)

		console.log('Got here', isAmountValid, isDateValid)

		if (!isAmountValid || !isDateValid) return

		const transaction = {
			id: String(Math.floor(Math.random() * 1000000)),
			description: formValues.descriptionField,
			amount: formValues.amountField,
			category: formValues.selectField,
			date: formValues.dateField,
		}

		console.log(transaction)

		const expenses = this.expense.getExpenses()
		const newExpenses = [...expenses, transaction]

		console.log(newExpenses, 'EX')

		this.expense.saveExpenses(newExpenses)
		this.querySelector('[data-add-transaction]').reset()
	}
}

customElements.define('add-transaction-form', AddTransactionForm)
