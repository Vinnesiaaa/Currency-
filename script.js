document.addEventListener('DOMContentLoaded', async () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const converterForm = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');

    if (!fromCurrency || !toCurrency || !converterForm || !resultDiv) {
        console.error('One or more DOM elements not found:', { fromCurrency, toCurrency, converterForm, resultDiv });
        resultDiv.innerHTML = 'Error: Page elements not loaded correctly. Please refresh.';
        return;
    }

    // Fungsi untuk memuat daftar mata uang dari Frankfurter
    async function loadCurrencies() {
        try {
            const response = await fetch('https://api.frankfurter.app/currencies', {
                mode: 'cors'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('Currencies fetched:', data);
            const currencies = Object.keys(data);
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
            console.error('Error fetching currencies:', error);
            resultDiv.innerHTML = 'Failed to load currency list. Check console for details.';
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
            const response = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`, {
                mode: 'cors'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('Conversion data:', data);
            if (data.rates && data.rates[to]) {
                resultDiv.innerHTML = `${amount} ${from} = ${data.rates[to].toFixed(2)} ${to}`;
            } else {
                resultDiv.innerHTML = 'Conversion not available. Check selected currencies.';
            }
        } catch (error) {
            console.error('Error converting currency:', error);
            resultDiv.innerHTML = 'Error fetching conversion data. Check console for details.';
        }
    });
});
