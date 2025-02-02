document.addEventListener("DOMContentLoaded", () => {
    // Load quotes from local storage or initialize default quotes
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
        { text: "Believe you can and you're halfway there.", category: "Inspiration" }
    ];

    // DOM Elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const quoteContainer = document.createElement("div"); // For form placement
    document.body.appendChild(quoteContainer);

    // Function to display a random quote and save it in session storage
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes available.</em>";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><em>Category: ${randomQuote.category}</em>`;

        // Store last viewed quote in session storage
        sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
    }

    // Function to create and display the Add Quote form dynamically
    function createAddQuoteForm() {
        quoteContainer.innerHTML = `
            <h2>Add a New Quote</h2>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button id="addQuoteBtn">Add Quote</button>
            
            <h3>Filter by Category</h3>
            <select id="categorySelect">
                <option value="all">All</option>
            </select>

            <h3>Import/Export Quotes</h3>
            <input type="file" id="importFile" accept=".json" />
            <button id="exportQuotes">Export Quotes</button>
        `;

        // Get form elements
        const addQuoteButton = document.getElementById("addQuoteBtn");
        const newQuoteText = document.getElementById("newQuoteText");
        const newQuoteCategory = document.getElementById("newQuoteCategory");
        const categorySelect = document.getElementById("categorySelect");
        const importFileInput = document.getElementById("importFile");
        const exportQuotesButton = document.getElementById("exportQuotes");

        // Function to save quotes to local storage
        function saveQuotes() {
            localStorage.setItem("quotes", JSON.stringify(quotes));
        }

        // Function to add a new quote
        function addQuote() {
            const text = newQuoteText.value.trim();
            const category = newQuoteCategory.value.trim();

            if (text === "" || category === "") {
                alert("Please enter both quote text and category.");
                return;
            }

            quotes.push({ text, category });
            saveQuotes();

            // Add category to dropdown if it's new
            if (![...categorySelect.options].some(option => option.value === category)) {
                categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
            }

            // Clear input fields
            newQuoteText.value = "";
            newQuoteCategory.value = "";

            alert("Quote added successfully!");
        }

        // Function to export quotes as JSON
        function exportQuotes() {
            const jsonQuotes = JSON.stringify(quotes, null, 2);
            const blob = new Blob([jsonQuotes], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "quotes.json";
            a.click();
            URL.revokeObjectURL(url);
        }

        // Function to import quotes from JSON
        function importFromJsonFile(event) {
            const fileReader = new FileReader();
            fileReader.onload = function (event) {
                try {
                    const importedQuotes = JSON.parse(event.target.result);
                    if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format");
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    alert("Quotes imported successfully!");
                } catch (error) {
                    alert("Invalid JSON file!");
                }
            };
            fileReader.readAsText(event.target.files[0]);
        }

        // Populate category dropdown dynamically
        function populateCategories() {
            let optionsHTML = '<option value="all">All</option>';
            const uniqueCategories = [...new Set(quotes.map(q => q.category))];

            uniqueCategories.forEach(category => {
                optionsHTML += `<option value="${category}">${category}</option>`;
            });

            categorySelect.innerHTML = optionsHTML;
        }

        // Attach event listeners
        addQuoteButton.addEventListener("click", addQuote);
        exportQuotesButton.addEventListener("click", exportQuotes);
        importFileInput.addEventListener("change", importFromJsonFile);

        // Populate category dropdown
        populateCategories();
    }

    // Event Listener for new quotes
    newQuoteButton.addEventListener("click", showRandomQuote);

    // Initialize app
    createAddQuoteForm();
    showRandomQuote();

    // Load last viewed quote from session storage if available
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
        const parsedQuote = JSON.parse(lastQuote);
        quoteDisplay.innerHTML = `<p>"${parsedQuote.text}"</p><em>Category: ${parsedQuote.category}</em>`;
    }
});
