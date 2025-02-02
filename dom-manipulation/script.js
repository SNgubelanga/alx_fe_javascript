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
        categoryFilter.innerHTML = ""; // Clear previous options
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Categories";
        categoryFilter.appendChild(allOption);

        uniqueCategories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
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

        quoteDisplay.innerHTML = ""; // Clear previous quote display

        if (filteredQuotes.length === 0) {
            const noQuoteMessage = document.createElement("em");
            noQuoteMessage.textContent = "No quotes available for this category.";
            quoteDisplay.appendChild(noQuoteMessage);
        } else {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];

            const quoteText = document.createElement("p");
            quoteText.textContent = `"${randomQuote.text}"`;

            const quoteCategory = document.createElement("em");
            quoteCategory.textContent = `Category: ${randomQuote.category}`;

            quoteDisplay.appendChild(quoteText);
            quoteDisplay.appendChild(quoteCategory);
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
        document.body.appendChild(a); // Append link before clicking
        a.click();
        document.body.removeChild(a); // Remove after download
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
