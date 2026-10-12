import {BooksSvg, TransportSvg, GrociesSvg, OthersSvg, FoodSvg, EnterainmentSvg, MoneySvg} from "../../lib/svg.js";

class RecentActivity extends HTMLElement {
	async connectedCallback() {
		const url = new URL('./recent-activity.html', import.meta.url);

		try {
			const response = await fetch(url);
			if (!response.ok) {
        throw new Error(
          `Failed to load navigation: ${response.status} ${response.url}`
        );
      }

			this.innerHTML = await response.text();
			this.renderRecentActivities();
		} catch (e) {
			console.error(e);
		}
	}

	getExpenses() {
		try {
			return JSON.parse(localStorage.getItem('expenses') || []);
		} catch (e) {
			console.error("Failed to load from LocalStorage: ", e);
			return [];
		}
	}


	renderRecentActivities() {
	  const expenses = this.getExpenses().slice(-8).reverse();
	  const raList = this.querySelector('[data-recent-activity-list]');

	  if (!raList) return;
	  raList.replaceChildren();

	  expenses.forEach((expense) => {
	    const li = document.createElement('li');

	    const flexDiv = document.createElement('div');
	    flexDiv.className = 'flex-layout';

	    const itemDivContainer = document.createElement('div');
	    itemDivContainer.className = 'recent-activity__item-container';

	    const iconContainer = document.createElement('span');
	    iconContainer.className = 'recent-activity__icon';

	    const icon = this.getIcon(expense.category.toLowerCase());
	    iconContainer.insertAdjacentHTML('beforeend', icon);

	    const raDescription = document.createElement('p');
	    raDescription.className = 'recent-activity__description';
	    raDescription.textContent = expense.description;

	    const raCategorySpan = document.createElement('span');
	    raCategorySpan.className = 'recent-activity__category';
	    raCategorySpan.textContent = `${expense.category} · ${expense.date}`;

	    const raDescriptionContainer = document.createElement('div');
	    raDescriptionContainer.className =
	      'recent-activity__description-container';

	    const raPriceContainer = document.createElement('p');
	    raPriceContainer.className = 'recent-activity__price';
	    raPriceContainer.textContent =
	      `$${Number(expense.amount).toFixed(2)}`;

	    raDescriptionContainer.append(raDescription, raCategorySpan);

	    itemDivContainer.append(iconContainer, raDescriptionContainer);

	    flexDiv.append(itemDivContainer, raPriceContainer);
	    li.append(flexDiv);
	    raList.append(li);
	  });
	}

	getIcon(category) {
		switch (category) {
			case 'books':
				return BooksSvg();

			case 'entertainment':
				return EnterainmentSvg();

			case 'transport':
				return TransportSvg();

			case 'food':
				return GrociesSvg();

			case 'fees':
				return MoneySvg()

			case 'other':
				return OthersSvg();

			default:
				return OthersSvg()
		}
	}
}

customElements.define('recent-activity', RecentActivity);
