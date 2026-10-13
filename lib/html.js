async function injectHTMLTemplate(fileName, DOM) {
	const folderName = fileName.split('.')[0]
	const url = new URL(`../modules/${folderName}/${fileName}`, import.meta.url)

	try {
		const response = await fetch(url)
		if (!response.ok) {
			throw new Error('Failed to load transactions table', response.url)
		}

		DOM.innerHTML = await response.text()
	} catch (error) {
		console.error('Failed to load the HTML: ', error)
	}
}

export { injectHTMLTemplate }
