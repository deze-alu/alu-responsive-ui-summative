class Storage {
	constructor(key) {
		this.key = key
	}

	get() {
		try {
			return JSON.parse(localStorage.getItem(this.key)) ?? []
		} catch (error) {
			console.error("Couldn't fetch storage item: ", error)
			return []
		}
	}

	set(value) {
		try {
			const store = this.get()
			const newItem = [...store, ...value]
			localStorage.setItem(this.key, JSON.stringify(newItem))
			return true
		} catch (error) {
			console.log("Couldn't set storage item: ", error)
			return false
		}
	}

	removeItem() {
		try {
			localStorage.removeItem(this.key)
			return true
		} catch (e) {
			console.log("Couldn't remove the item: ", e)
			return false
		}
	}
}

export { Storage }
