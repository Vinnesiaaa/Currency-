document.addEventListener('DOMContentLoaded', async () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const converterForm = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');

    // Fetch available currencies
    async function loadCurrencies() {
        try {
            const response = await fetch('https://api.exchangerate.host/symbols', {
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Network response was not ok');
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
            resultDiv.innerHTML = 'Error loading currency list. Please check your internet connection or try again later.';
            // Fallback currencies
            ['USD', 'EUR', 'IDR', 'JPY', 'GBP'].forEach(currency => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = option2.value = currency;
                option1.text = option2.text = currency;
                fromCurrency.appendChild(option1);
                toCurrency.appendChild(option2);
            });
        }
    }

    // Load currencies when page loads
    loadCurrencies();

    // Handle form submission
    converterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (!amount || !from || !to) {
            resultDiv.innerHTML = 'Please fill in all fields.';
            return;
        }

        try {
            const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`, {
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Conversion failed');
            const data = await response.json();
            if (data.result) {
                resultDiv.innerHTML = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
            } else {
                resultDiv.innerHTML = 'Error fetching conversion data.';
            }
        } catch (error) {
            console.error('Error converting currency:', error);
            resultDiv.innerHTML = 'Error fetching conversion data. Please try again later.';
        }
    });
});
