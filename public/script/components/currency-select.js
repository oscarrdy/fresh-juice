// Currency Selector
const currencySelector = document.getElementById('nav_currencySelector');
const selectedCurrency = currencySelector.getAttribute('data-selected-currency');
currencySelector.value = selectedCurrency;

currencySelector.addEventListener('change', async () => {
    
    // Send a POST request to the server to change the currency
    await fetch('/shop/change-currency', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ new_currency: currencySelector.value })
    }).then(res => res.json())

    // Emit a 'currency-changed' event
    document.dispatchEvent(new Event('currency-changed'));

});