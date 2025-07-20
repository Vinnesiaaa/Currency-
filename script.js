console.log('Script loaded');

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Loaded');

    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const converterForm = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');

    // Fetch available currencies
    try {
        const response = await fetch('https://api.exchangerate.host/symbols');
        const data = await response.json();
        console.log('Symbols response:', data);

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
        resultDiv.innerHTML = 'Error loading currency list';
    }

    // Form submission
    converterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const from = fromCurrency.value;
        const to = toCurrency.value;

        console.log(`Convert: ${amount} ${from} to ${to}`);

        if (!amount || !from || !to) {
            resultDiv.innerHTML = 'Please fill in all fields';
            return;
        }

        try {
            const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
            const data = await response.json();
            console.log('Convert response:', data);

            if (data.result) {
                resultDiv.innerHTML = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
            } else {
                resultDiv.innerHTML = 'Conversion error.';
            }
        } catch (error) {
            console.error('Error converting currency:', error);
            resultDiv.innerHTML = 'Error fetching conversion data.';
        }
    });
});
