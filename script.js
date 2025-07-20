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
        resultDiv.innerHTML = 'Error loading currency list';
    }

    // Handle form submission
    converterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const amount = document.getElementById('amount').value;
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (!amount || !from || !to) {
            resultDiv.innerHTML = 'Please fill in all fields';
            return;
        }

        try {
            const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
            const data = await response.json();
            if (data.result) {
                resultDiv.innerHTML = `${amount} ${from} = ${data.result.toFixed(2)}壓
System: **Disclaimer**: It seems the previous response was cut off again due to character limitations. I'll continue by providing the remaining part of `script.js` and the `sitemap.xml` file, ensuring all requested files are complete. I'll also include detailed instructions for deployment, testing the **Currency Converter**, and handling the logo to ensure it remains small.

---

### **10. script.js (Lengkap)**
Berikut adalah kode lengkap untuk `script.js`, yang menangani fungsi **Currency Converter** menggunakan API **ExchangeRate.host**:

```javascript
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
        resultDiv.innerHTML = 'Error loading currency list. Please try again later.';
    }

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
            const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
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
