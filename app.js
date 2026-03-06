const currencyToUsdRate = { 
    "USD": 1,
    "EUR": 0.85,
    "JPY": 110,
    "GBP": 0.75,
    // ... other currencies
};

async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        Object.keys(currencyToUsdRate).forEach(currency => {
            if (data.rates[currency]) {
                currencyToUsdRate[currency] = data.rates[currency];
            }
        });
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

// Call fetchExchangeRates after DOM elements are retrieved but before rendering passes
document.addEventListener('DOMContentLoaded', async () => {
    await fetchExchangeRates();
    // Call the function that renders your currencies here
    renderCurrencies();
});
