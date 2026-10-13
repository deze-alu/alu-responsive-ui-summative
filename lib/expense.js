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
}

export { Expense }
