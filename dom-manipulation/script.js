document.addEventListener("DOMContentLoaded", () => {
    // Initial Quotes
    let quotes = [
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
    const categorySelect = document.getElementById("categorySelect");

    // Function to display a random quote
    function showRandomQuote() {
        const selectedCategory = categorySelect.value;
        const filteredQuotes = selectedCategory === "all"
            ? quotes
            : quotes.filter(quote => quote.category === selectedCategory);

        if (filteredQuotes.length === 0) {
            quoteDisplay.innerText = "No quotes available for this category.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.innerText = filteredQuotes[randomIndex].text;
    }

    // Function to add a new quote
    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text === "" || category === "") {
            alert("Please enter both quote text and category.");
            return;
        }

        // Add new quote to the list
        quotes.push({ text, category });

        // Add category to dropdown if it's new
        if (![...categorySelect.options].some(option => option.value === category)) {
            const newOption = document.createElement("option");
            newOption.value = category;
            newOption.innerText = category;
            categorySelect.appendChild(newOption);
        }

        // Clear input fields
        newQuoteText.value = "";
        newQuoteCategory.value = "";

        alert("Quote added successfully!");
    }

    // Populate category dropdown
    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(q => q.category))];

        uniqueCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.innerText = category;
            categorySelect.appendChild(option);
        });
    }

    // Event Listeners
    newQuoteButton.addEventListener("click", showRandomQuote);
    addQuoteButton.addEventListener("click", addQuote);
    
    // Load categories and initial quote
    populateCategories();
    showRandomQuote();
});
