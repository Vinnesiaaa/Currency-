document.addEventListener('DOMContentLoaded', async () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const converterForm = document.getElementById('converter-form');
    const resultDiv = document.getElementById('result');
    const contentDiv = document.getElementById('content');

    if (!fromCurrency || !toCurrency || !converterForm || !resultDiv || !contentDiv) {
        console.error('DOM elements not found:', { fromCurrency, toCurrency, converterForm, resultDiv, contentDiv });
        resultDiv.innerHTML = 'Error: Page elements not loaded correctly. Please refresh or check code.';
        return;
    }

    // Fungsi untuk memuat daftar mata uang dari Frankfurter dengan nama lengkap
    async function loadCurrencies() {
        try {
            const response = await fetch('https://api.frankfurter.app/currencies', {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache'
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log('API Response (currencies):', data);
            const currencies = Object.entries(data); // [ [code, name], ... ]
            if (currencies.length === 0) throw new Error('No currencies returned by API');
            fromCurrency.innerHTML = '<option value="">Select Currency</option>';
            toCurrency.innerHTML = '<option value="">Select Currency</option>';
            currencies.forEach(([code, name]) => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = option2.value = code;
                option1.text = option2.text = `${code} - ${name}`;
                fromCurrency.appendChild(option1);
                toCurrency.appendChild(option2);
            });
        } catch (error) {
            console.error('Error loading currencies:', error);
            resultDiv.innerHTML = 'Failed to load currencies. Check console or try again later.';
            const fallbackCurrencies = {
                'USD': 'United States Dollar',
                'EUR': 'Euro',
                'IDR': 'Indonesian Rupiah',
                'JPY': 'Japanese Yen',
                'GBP': 'British Pound',
                'AUD': 'Australian Dollar',
                'CAD': 'Canadian Dollar',
                'CHF': 'Swiss Franc',
                'CNY': 'Chinese Yuan',
                'SGD': 'Singapore Dollar'
            };
            fromCurrency.innerHTML = '<option value="">Select Currency</option>';
            toCurrency.innerHTML = '<option value="">Select Currency</option>';
            Object.entries(fallbackCurrencies).forEach(([code, name]) => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = option2.value = code;
                option1.text = option2.text = `${code} - ${name}`;
                fromCurrency.appendChild(option1);
                toCurrency.appendChild(option2);
            });
        }
    }

    // Fungsi untuk memuat konten halaman berdasarkan rute
    function loadPage() {
        const path = window.location.pathname;
        let content = '';

        switch (path) {
            case '/':
                content = `
                    <h1 class="text-4xl font-bold text-center text-yellow-400 mb-8">Real-Time Currency Converter</h1>
                    <div class="max-w-md mx-auto bg-purple-800 p-6 rounded-lg shadow-lg">
                        <form id="converter-form">
                            <div class="mb-4">
                                <label for="amount" class="block text-yellow-300">Amount</label>
                                <input type="number" id="amount" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" placeholder="Enter amount" required min="0" step="0.01">
                            </div>
                            <div class="mb-4">
                                <label for="from-currency" class="block text-yellow-300">From</label>
                                <select id="from-currency" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" required>
                                    <option value="">Select Currency</option>
                                </select>
                            </div>
                            <div class="mb-4">
                                <label for="to-currency" class="block text-yellow-300">To</label>
                                <select id="to-currency" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-600" required>
                                    <option value="">Select Currency</option>
                                </select>
                            </div>
                            <button type="submit" class="w-full bg-yellow-400 text-gray-900 py-2 rounded hover:bg-yellow-500 transition duration-200">Convert</button>
                        </form>
                        <div id="result" class="mt-4 text-center text-yellow-300"></div>
                    </div>
                `;
                break;
            case '/about':
                content = '<h1 class="text-4xl font-bold text-center text-yellow-400 mb-8">About Us</h1><p class="text-center">This is the about page. Add your content here!</p>';
                break;
            case '/terms':
                content = '<h1 class="text-4xl font-bold text-center text-yellow-400 mb-8">Terms of Service</h1><p class="text-center">This is the terms page. Add your terms here!</p>';
                break;
            case '/privacy':
                content = '<h1 class="text-4xl font-bold text-center text-yellow-400 mb-8">Privacy Policy</h1><p class="text-center">This is the privacy page. Add your policy here!</p>';
                break;
            case '/blog':
                content = '<h1 class="text-4xl font-bold text-center text-yellow-400 mb-8">Blog</h1><p class="text-center">This is the blog page. Add your blog posts here!</p>';
                break;
            default:
                content = '<h1 class="text-4xl font-bold text-center text-yellow-400 mb-8">Page Not Found</h1><p class="text-center">The page you are looking for does not exist.</p>';
        }
        contentDiv.innerHTML = content;

        // Reload currencies and form if on home page
        if (path === '/') {
            loadCurrencies();
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
                        method: 'GET',
                        mode: 'cors',
                        cache: 'no-cache'
                    });
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    const data = await response.json();
                    console.log('API Response (conversion):', data);
                    if (data.rates && data.rates[to]) {
                        resultDiv.innerHTML = `${amount} ${from} = ${data.rates[to].toFixed(2)} ${to}`;
                    } else {
                        resultDiv.innerHTML = 'Conversion failed. Check if currencies are valid.';
                    }
                } catch (error) {
                    console.error('Error converting currency:', error);
                    resultDiv.innerHTML = `Error: ${error.message}. Check console for details.`;
                }
            });
        }
    }

    // Load page on initial load and navigation
    window.addEventListener('popstate', loadPage);
    loadPage();
});
