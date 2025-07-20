document.addEventListener('DOMContentLoaded', async () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const converterForm = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');

    // Fungsi untuk memuat mata uang dari Frankfurter
    async function loadCurrencies() {
        try {
            const response = await fetch('https://api.frankfurter.app/latest', {
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const currencies = Object.keys(data.rates);
            // Tambahkan base currency (EUR) ke daftar
            currencies.unshift(data.base);
            // Kosongkan dropdown sebelum mengisi
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
            console.error('Error fetching currencies from Frankfurter:', error);
            resultDiv.innerHTML = 'Failed to load currency list. Using fallback currencies.';
            // Fallback currencies jika API gagal
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
            const response = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}&amount=${amount}`, {
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Conversion failed');
            const data = await response.json();
            if (data.rates && data.rates[to]) {
                resultDiv.innerHTML = `${amount} ${from} = ${data.rates[to].toFixed(2)} ${to}`;
            } else {
                resultDiv.innerHTML = 'Conversion not available for selected currencies.';
            }
        } catch (error) {
            console.error('Error converting currency:', error);
            resultDiv.innerHTML = 'Error fetching conversion data. Please try again later.';
        }
    });
});
