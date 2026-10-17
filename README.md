# Finance Tracker

Finance Tracker is a small web app for students. You add your expenses, and the app shows you where your money goes. It runs fully in the browser. There is no backend and no build step. All data is saved in your browser's Local Storage.

**Live Application:** <a href="https://deze-alu.github.io/alu-responsive-ui-summative/" target="_blank" rel="noopener noreferrer">View the Finance Tracker</a>
<br>
**YouTube Walkthrough:** <a href="https://youtu.be/XJvEt1RHhGo" target="_blank" rel="noopener noreferrer">Watch the project walkthrough</a>

**Figma Design:** <a href="https://www.figma.com/design/BNlV7CWl5eHY331nZckgYB/Untitled?node-id=2-8256&t=ccFpNJak9SHnYxNR-1" target="_blank" rel="noopener noreferrer">Open the design file</a>

## Contents

- [Overview](#overview)
- [Setup Guide](#setup-guide)
- [Features](#features)
- [Project Structure](#project-structure)
- [Regex Catalog](#regex-catalog)
- [Code Report](#code-report)

## Overview

The app has four pages:

- **Overview** (`index.html`) shows summary cards, a doughnut chart of expenses by category, and a list of recent activity.
- **Transactions** (`transactions.html`) shows every expense in a table. You can search, sort, import and export.
- **Add Transaction** (`add-transaction.html`) has a form to add a new expense with validation.
- **About** (`about.html`) explains the purpose of the app.

The app is built with plain HTML, CSS and JavaScript. Each part of the user interface is a native Web Component (a custom HTML element). Each component loads its own HTML template with `fetch()` and then adds behaviour with JavaScript. Chart.js is the only outside library, and it is loaded from a CDN for the doughnut chart.

## Setup Guide

You need a modern browser and a simple local web server. You do not need Node.js or any package manager.

1. Clone the repository:

   ```bash
   git clone https://github.com/deze-alu/alu-responsive-ui-summative.git
   ```

2. Go into the project folder:

   ```bash
   cd alu-responsive-ui-summative
   ```

3. Start a local server. Pick one of these options:
   - Use the **Live Server** extension in VS Code. Right click `index.html` and choose "Open with Live Server".
   - Or use Python:

     ```bash
     python3 -m http.server 8000
     ```

   - Or use Node.js if you have it:

     ```bash
     npx serve .
     ```

4. Open the local address shown by your server in a browser, for example `http://localhost:8000`.

5. (Optional) Load sample data. Go to the Transactions page, click **Import Expenses**, and choose the `seed.json` file from the project root.

**Important:** Do not open `index.html` directly from your file system. The app uses JavaScript modules and loads HTML templates with `fetch()`. Both of these need an HTTP server.

## Features

- **Dashboard overview.** Summary cards, a doughnut chart of expenses by category, and a legend with the percentage and amount for each category.
- **Recent activity.** The eight most recent expenses, newest first, each with a category icon.
- **Transactions table.** A full list of expenses. Click a column header to sort. Click again to flip the order. The default sort is by date, newest first.
- **Smart search.** Type in the search box to filter the table as you type. The search understands record IDs, amounts and free text. See the Regex Catalog below.
- **Add transaction form.** Add an expense with an amount, category, date and description. The form validates as you type and shows an error message next to the field.
- **Import and export.** Export all expenses to a JSON file. Import a JSON file to add expenses. After an import, the chart, recent activity and table all refresh on their own through a custom `file-imported` event.
- **Local Storage.** All data is saved in the browser under the key `expenses`. Nothing is sent to a server.
- **Responsive layout.** The layout adapts for phones, tablets and desktops. The main breakpoints are 480px and 768px.

## Project Structure

- `index.html`, `transactions.html`, `add-transaction.html`, `about.html` are the four pages.
- `assets/css/` holds the styles. `tokens.css` has the design tokens, `reset.css` resets browser defaults, `utils.css` has helper classes, and `modules/` has one file per component.
- `lib/` holds shared JavaScript.
  - `storage.js` wraps Local Storage with safe get, set and remove methods.
  - `expense.js` reads and writes expenses, sums totals by category, and handles import and export.
  - `html.js` loads a component's HTML template into the page.
  - `svg.js` has the inline category icons.
- `modules/` holds the Web Components. Each folder has one HTML template and one JavaScript file. `modules.js` imports them all.
- `seed.json` is sample data you can import.
- `codevibe-report/` holds the CodeVibe report files.

## Regex Catalog

The app uses five regular expressions. Each one is listed here with what it does and where it lives.

### 1. Amount validation

```
/^(0|[1-9]\d*)(\.\d{1,2})?$/
```

- **Where:** `modules/add-transaction-form/add-transaction-form.js`, in `validateAmount()`.
- **What it does:** Accepts a whole number or a number with one or two decimal places. It does not allow leading zeros like `007`, and it does not allow more than two decimals.

### 2. Date validation

```
/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
```

- **Where:** `modules/add-transaction-form/add-transaction-form.js`, in `validateDate()`.
- **What it does:** Checks that the date has the shape `YYYY-MM-DD`. The month must be `01` to `12`. The day must be `01` to `31`.

### 3. Description validation

```
/^\S(?:.*\S)?$/
```

- **Where:** `modules/add-transaction-form/add-transaction-form.js`, in `validateDescritpion()`.
- **What it does:** Makes sure the description starts and ends with a non-space character. A single character is fine. The value is trimmed before the test, so this mostly guards against empty or whitespace-only input.

### 4. Search by record ID

```
/^rec_\d+$/i
```

- **Where:** `modules/transactions-table/transactions-table.js`, in `search()`.
- **What it does:** Detects when the search text looks like a record ID, such as `rec_0001`. The `i` flag makes it case-insensitive. When it matches, the table shows only the row with that exact ID.

### 5. Search by amount

```
/^\d+(\.\d{1,2})?$/
```

- **Where:** `modules/transactions-table/transactions-table.js`, in `search()`.
- **What it does:** Detects when the search text looks like a money amount. When it matches, the table shows rows whose amount contains that text. For example, typing `12.5` shows a row with amount `12.5`, and typing `45` shows `45` and also `450`.

If the search text matches neither the ID pattern nor the amount pattern, the app does a plain text search across the ID, description, category and amount.

## Code Report

The `codevibe-report/` folder holds the data for CodeVibe. It also has a `crack.py` file. This was an attempt to crack the JSON report, as requested by the instructor.
