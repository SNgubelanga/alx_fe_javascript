document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated API
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [];
    let lastSyncTime = localStorage.getItem("lastSyncTime") || 0;

    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");
    const formContainer = document.getElementById("formContainer");
    const syncButton = document.getElementById("syncQuotes"); // Sync button
    const notificationArea = document.getElementById("notification");

    // Function to create Add Quote form
    function createAddQuoteForm() {
        formContainer.innerHTML = "";

        const form = document.createElement("div");

        const inputQuote = document.createElement("input");
        inputQuote.id = "newQuoteText";
        inputQuote.type = "text";
        inputQuote.placeholder = "Enter a new quote";

        const inputCategory = document.createElement("input");
        inputCategory.id = "newQuoteCategory";
        inputCategory.type = "text";
        inputCategory.placeholder = "Enter quote category";

        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";
        addButton.onclick = addQuote;

        form.appendChild(inputQuote);
        form.appendChild(inputCategory);
        form.appendChild(addButton);

        formContainer.appendChild(form);
    }

    // Function to populate the category dropdown
    function populateCategories() {
        const uniqueCategories = [...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = "";

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

        quoteDisplay.innerHTML = "";

        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = "<em>No quotes available for this category.</em>";
        } else {
            const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
            quoteDisplay.innerHTML = `<p>"${randomQuote.text}"</p><em>Category: ${randomQuote.category}</em>`;
        }
    }

    // Function to filter quotes based on category
    function filterQuotes() {
        localStorage.setItem("selectedCategory", categoryFilter.value);
        showRandomQuote();
    }

    // Function to add a new quote
    function addQuote() {
        const newQuoteText = document.getElementById("newQuoteText").value.trim();
        const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

        if (newQuoteText === "" || newQuoteCategory === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        const newQuote = { text: newQuoteText, category: newQuoteCategory, id: Date.now() };
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        alert("Quote added successfully!");
    }

    // Save quotes to local storage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        localStorage.setItem("lastSyncTime", Date.now());
    }

    // Simulated fetch from server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch(API_URL);
            const serverQuotes = await response.json();

            if (!Array.isArray(serverQuotes)) throw new Error("Invalid server response");

            const formattedQuotes = serverQuotes.slice(0, 5).map(q => ({
                text: q.title,
                category: "General",
                id: q.id
            }));

            resolveConflicts(formattedQuotes);
        } catch (error) {
            console.error("Error fetching quotes:", error);
            showNotification("Failed to sync with server!", "error");
        }
    }

    // Function to resolve conflicts between server and local data
    function resolveConflicts(serverQuotes) {
        let conflictsDetected = false;

        serverQuotes.forEach(serverQuote => {
            const existsLocally = quotes.some(q => q.id === serverQuote.id);

            if (!existsLocally) {
                quotes.push(serverQuote);
                conflictsDetected = true;
            }
        });

        if (conflictsDetected) {
            saveQuotes();
            showNotification("New quotes were added from the server!", "info");
        }
    }

    // Function to manually sync quotes
    function manualSync() {
        fetchQuotesFromServer();
        showNotification("Syncing with server...", "loading");
    }

    // Function to show notifications
    function showNotification(message, type) {
        notificationArea.textContent = message;
        notificationArea.className = `notification ${type}`;

        setTimeout(() => {
            notificationArea.textContent = "";
            notificationArea.className = "";
        }, 3000);
    }

    // Periodic Sync (every 30 seconds)
    setInterval(fetchQuotesFromServer, 30000);

    // Event Listeners
    newQuoteButton.addEventListener("click", showRandomQuote);
    categoryFilter.addEventListener("change", filterQuotes);
    syncButton.addEventListener("click", manualSync);

    // Initialize
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();
});
