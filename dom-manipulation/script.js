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
    const addQuoteButton = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const categoryFilter = document.getElementById("categoryFilter");
    const importFileInput = document.getElementById("importFile");
    const exportQuotesButton = document.getElementById("exportQuotes");

    // Function to save quotes to local storage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Function to populate category filter dynamically
    function populateCategories() {
        let categories = [...new Set(quotes.map(q => q.category))];
        categories.unshift("All Categories");

        categoryFilter.innerHTML = categories
            .map(category => `<option value="${category}">${category}</option>`)
            .join('');

        // Restore last selected category filter
        const lastSelectedFilter = localStorage.getItem("selectedCategory");
        if (lastSelectedFilter) {
            categoryFilter.value = lastSelectedFilter;
        }
    }

    // Function to filter quotes based on selected category
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory);

        const filteredQuotes = selectedCategory === "All Categories"
            ? quotes
            : quotes.filter(quote => quote.category === selectedCategory);

        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
        } else {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><em>Category: ${randomQuote.category}</em>`;
        }
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

        populateCategories();
        alert("Quote added successfully!");

        newQuoteText.value = "";
        newQuoteCategory.value = "";
    }

    // Export quotes to JSON
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

    // Import quotes from JSON
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format");
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
            } catch (error) {
                alert("Invalid JSON file!");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Event Listeners
    newQuoteButton.addEventListener("click", filterQuotes);
    addQuoteButton.addEventListener("click", addQuote);
    exportQuotesButton.addEventListener("click", exportQuotes);
    importFileInput.addEventListener("change", importFromJsonFile);
    categoryFilter.addEventListener("change", filterQuotes);

    // Initialize app
    populateCategories();
    filterQuotes(); // Display initial quote based on selected category
});
