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
    const quoteContainer = document.createElement("div"); // For form placement
    document.body.appendChild(quoteContainer); // Append form container to body

    // Function to display a random quote using innerHTML
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes available.</em>";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.innerHTML = `<p>"${quotes[randomIndex].text}"</p><em>Category: ${quotes[randomIndex].category}</em>`;
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
        `;

        // Re-select form elements after they are dynamically added
        const addQuoteButton = document.getElementById("addQuoteBtn");
        const newQuoteText = document.getElementById("newQuoteText");
        const newQuoteCategory = document.getElementById("newQuoteCategory");
        const categorySelect = document.getElementById("categorySelect");

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
                categorySelect.innerHTML += `<option value="${category}">${category}</option>`;
            }

            // Clear input fields
            newQuoteText.value = "";
            newQuoteCategory.value = "";

            alert("Quote added successfully!");
        }

        // Function to populate categories dynamically
        function populateCategories() {
            let optionsHTML = '<option value="all">All</option>';
            const uniqueCategories = [...new Set(quotes.map(q => q.category))];

            uniqueCategories.forEach(category => {
                optionsHTML += `<option value="${category}">${category}</option>`;
            });

            categorySelect.innerHTML = optionsHTML;
        }

        // Event Listener for Adding Quotes
        addQuoteButton.addEventListener("click", addQuote);

        // Populate category dropdown
        populateCategories();
    }

    // Event Listeners
    newQuoteButton.addEventListener("click", showRandomQuote);

    // Initialize app
    createAddQuoteForm();
    showRandomQuote();
});
