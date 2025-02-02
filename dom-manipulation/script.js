document.addEventListener("DOMContentLoaded", () => {
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
        { text: "Believe you can and you're halfway there.", category: "Inspiration" }
    ];

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const addQuoteButton = document.getElementById("addQuoteBtn");
    const importFileInput = document.getElementById("importFile");
    const exportQuotesButton = document.getElementById("exportQuotes");

    // Function to populate the category dropdown
    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
        uniqueCategories.forEach(category => {
            categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
        });
        const savedFilter = localStorage.getItem("selectedCategory");
        if (savedFilter) categoryFilter.value = savedFilter;
    }

    // Function to display a random quote
    function showRandomQuote() {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === "all"
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

    // Function to filter quotes based on selected category
    function filterQuotes() {
        localStorage.setItem("selectedCategory", categoryFilter.value);
        showRandomQuote();
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
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        newQuoteText.value = "";
        newQuoteCategory.value = "";
        alert("Quote added successfully!");
    }

    // Function to export quotes to a JSON file
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

    // Function to import quotes from a JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (!Array.isArray(importedQuotes)) throw new Error("Invalid file format");
                quotes.push(...importedQuotes);
                localStorage.setItem("quotes", JSON.stringify(quotes));
                populateCategories();
                alert("Quotes imported successfully!");
            } catch (error) {
                alert("Invalid JSON file!");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Event Listeners
    newQuoteButton.addEventListener("click", showRandomQuote);
    addQuoteButton.addEventListener("click", addQuote);
    importFileInput.addEventListener("change", importFromJsonFile);
    exportQuotesButton.addEventListener("click", exportQuotes);

    // Initialize
    populateCategories();
    showRandomQuote();
});
