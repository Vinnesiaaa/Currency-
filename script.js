document.addEventListener('DOMContentLoaded', async () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const converterForm = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');

    // Fungsi untuk memuat mata uang
    async function loadCurrencies() {
        try {
            const response = await fetch('https://api.exchangerate.host/symbols', {
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const currencies = Object.keys(data.symbols);
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
            console.error('Error fetching currencies from API:', error);
            resultDiv.innerHTML = 'Failed to load full currency list. Using fallback currencies.';
            // Daftar mata uang global sebagai fallback
            const fallbackCurrencies = [
                'USD', 'EUR', 'IDR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD',
                'HKD', 'MYR', 'THB', 'KRW', 'INR', 'NZD', 'SEK', 'NOK', 'DKK', 'ZAR',
                'MXN', 'BRL', 'RUB', 'TRY', 'AED', 'SAR', 'QAR', 'KWD', 'OMR', 'BHD'
                // Tambahkan lebih banyak jika perlu (total > 160 mata uang global)
            ];
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
