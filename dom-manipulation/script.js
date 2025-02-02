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

    // Function to display a random quote using innerHTML
    function showRandomQuote() {
        const selectedCategory = categorySelect.value;
        const filteredQuotes = selectedCategory === "all"
            ? quotes
            : quotes.filter(quote => quote.category === selectedCategory);

        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.innerHTML = `<p>"${filteredQuotes[randomIndex].text}"</p>`;
    }

    // Function to add a new quote using innerHTML
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
            categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
        }

        // Clear input fields
        newQuoteText.value = "";
        newQuoteCategory.value = "";

        alert("Quote added successfully!");
    }

    // Populate category dropdown using innerHTML
    function populateCategories() {
        let optionsHTML = '<option value="all">All</option>';
        const uniqueCategories = [...new Set(quotes.map(q => q.category))];

        uniqueCategories.forEach(category => {
            optionsHTML += `<option value="${category}">${category}</option>`;
        });

        categorySelect.innerHTML = optionsHTML;
    }

    // Event Listeners
    newQuoteButton.addEventListener("click", showRandomQuote);
    addQuoteButton.addEventListener("click", addQuote);
    
    // Load categories and initial quote
    populateCategories();
    showRandomQuote();
});
