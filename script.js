document.addEventListener('DOMContentLoaded', async () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const converterForm = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');

    // Fetch available currencies
    try {
        const response = await fetch('https://api.exchangerate.host/symbols');
        const data = await response.json();
        const currencies = Object.keys(data.symbols);

        currencies.forEach(currency => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = option2.value = currency;
            option1.text = option2.text = currency;
            fromCurrency.appendChild(option1);
            toCurrency.appendChild(option2);
        });
    } catch (error) {
        console.error('Error fetching currencies:', error);
    }

    // Handle form submission
    converterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const from = fromCurrency.value;
        const to = toCurrency.value;

        try {
            const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
            const data = await response.json();
            resultDiv.innerHTML = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
        } catch (error) {
            resultDiv.innerHTML = 'Error fetching conversion data';
            console.error(error);
        }
    });
});
