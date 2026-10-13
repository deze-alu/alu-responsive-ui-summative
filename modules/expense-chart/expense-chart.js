import {Expense} from "../../lib/expense.js";

class ExpenseChart extends HTMLElement {
	constructor() {
		super();
		this.expense = new Expense();
	}

	async connectedCallback() {
		this.chart = null;
		const url = new URL('./expense-chart.html', import.meta.url);
  	try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Failed to load navigation: ${response.status} ${response.url}`
        );
      }

      this.innerHTML = await response.text();
      this.renderChart();
    } catch (error) {
      console.error(error);
    }
	}

	renderChart() {
		const totals = this.expense.getTotalsByCategory();

		const categories = Object.keys(totals);
		const amounts = Object.values(totals);

		const totalAmountSpent = this.expense.getTotalAmountSpent();
		this.renderLegends(categories, totals, totalAmountSpent);
		this.renderPie(categories, amounts);
	}

	renderLegends(categories, totals, totalAmountSpent) {
		const legendContainer = this.querySelector('[data-expense-legend]');
		if (!legendContainer) return;

		// Clears the current DOM node we have
		legendContainer.replaceChildren()

		categories.forEach((category) => {
			const amount = totals[category];
			const percentage = totalAmountSpent
				? ((amount / totalAmountSpent) * 100).toFixed(1)
				: "0.0";

			const item = document.createElement("li");
			item.className = "expense-legend__item";

			const name = document.createElement("span");
			name.className = "expense-legend__name";
			name.textContent = category;

			const percentageElement = document.createElement("span");
			percentageElement.className = "expense-legend__percentage";
			percentageElement.textContent = `${percentage}%`;

			const amountElement = document.createElement("span");
			amountElement.className = "expense-legend__amount";
			amountElement.textContent = `$${amount.toFixed(2)}`;

			item.append(name, percentageElement, amountElement);
			legendContainer.append(item);
		});
	}

	renderPie(categories, amounts) {
		const canvas = this.querySelector('[data-expense-chart]');

		if (!canvas || typeof Chart === 'undefined') return;

		const colors = {
      Fees: "#FF3C00",
      Books: "#A0A0A0",
      Transport: "#EEEEEE",
      Food: "#3F3F3F",
			Entertainment: "#555555",
      Other: "#777777",
    };
		// So we can rerender on page navigation
		this.chart?.destroy();

		// https://www.chartjs.org/docs/latest/getting-started/
		this.chart = new Chart(canvas, {
			type: 'doughnut',
			data: { labels: categories, datasets: [{ data: amounts, backgroundColor: categories.map((category) => colors[category] ?? "#666666"), borderWidth: 0, hoverOffset: 4, }] },
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.label}: ${context.raw.toFixed(2)}`,
            },
					},
				},
			}
		})
	}
}

customElements.define("expense-chart", ExpenseChart);
