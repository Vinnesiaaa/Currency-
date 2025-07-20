document.addEventListener('DOMContentLoaded', async () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const converterForm = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');

    if (!fromCurrency || !toCurrency || !converterForm || !resultDiv) {
        console.error('DOM elements not found:', { fromCurrency, toCurrency, converterForm, resultDiv });
        resultDiv.innerHTML = 'Error: Page elements not loaded correctly. Please refresh or check code.';
        return;
    }

    // Fungsi untuk memuat daftar mata uang dari exchangerate.host
    async function loadCurrencies() {
        try {
            const response = await fetch('https://api.exchangerate.host/symbols', {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log('API Response (symbols):', data);
            const currencies = Object.keys(data.symbols);
            if (currencies.length === 0) throw new Error('No currencies returned by API');
            fromCurrency.innerHTML = '<option value="">Select Currency</option>';
            toCurrency.innerHTML = '<option value="">Select Currency</option>';
            currencies.forEach(currency => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = option2.value = currency;
                option1.text = option2.text = currency;
                fromCurrency.appendChild(option1);
                toCurrency.appendChild(option2);
            });
        } catch (error) {
            console.error('Error loading currencies:', error);
            resultDiv.innerHTML = 'Failed to load currencies. Check console or try again later.';
            const fallbackCurrencies = ['USD', 'EUR', 'IDR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD'];
            fromCurrency.innerHTML = '<option value="">Select Currency</option>';
            toCurrency.innerHTML = '<option value="">Select Currency</option>';
            fallbackCurrencies.forEach(currency => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = option2.value = currency;
                option1.text = option2.text = currency;
                fromCurrency.appendChild(option1);
                toCurrency.appendChild(option2);
            });
        }
    }

    // Muat mata uang saat halaman dimuat
    loadCurrencies();

    // Handle form submission untuk konversi
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
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log('API Response (convert):', data);
            if (data.result) {
                resultDiv.innerHTML = `${amount} ${from} = ${data.result.toFixed(2)} ${to}`;
            } else {
                resultDiv.innerHTML = 'Conversion failed. Check if currencies are valid.';
            }
        } catch (error) {
            console.error('Error converting currency:', error);
            resultDiv.innerHTML = `Error: ${error.message}. Check console for details.`;
        }
    });
});
