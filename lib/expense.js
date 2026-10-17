import { Storage } from './storage.js'

class Expense {
	constructor() {
		this.STORAGE_KEY = 'expenses'
		this.storage = new Storage(this.STORAGE_KEY)
	}

	getExpenses() {
		try {
			return this.storage.get()
		} catch (e) {
			console.error('Failed to load from LocalStorage: ', e)
			return []
		}
	}

	saveExpenses(transactions) {
		try {
			return this.storage.set(transactions)
		} catch (error) {
			console.error('Failed to add transactions: ', error)
		}
	}

	getTotalsByCategory() {
		const expenses = this.getExpenses()

		return expenses.reduce((acc, expense) => {
			const category = expense.category
			const amount = Number(expense.amount)

			acc[category] = (acc[category] ?? 0) + amount
			return acc
		}, {})
	}

	getTotalAmountSpent() {
		const expenses = this.getTotalsByCategory()
		const amounts = Object.values(expenses)

		return amounts.reduce((acc, amount) => acc + amount, 0)
	}

	async importExpenses(file) {
		const text = await file.text()
		const expenses = JSON.parse(text)

		if (!Array.isArray(expenses)) {
			throw new Error('Invalid input. Expenses must be an array json')
		}

		this.saveExpenses(expenses)
	}

	exportExpenses() {
		const expenses = this.getExpenses()

		// https://www.geeksforgeeks.org/javascript/create-a-data-export-and-import-using-html-css-and-javascript/
		const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' })

		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = 'expenses.json'
		link.click()

		URL.revokeObjectURL()
	}
}

export { Expense }
