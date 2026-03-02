document.addEventListener('DOMContentLoaded', async () => {
    const fromTokenSelect = document.getElementById('from-token');
    const toTokenSelect = document.getElementById('to-token');
    const fromTokenIcon = document.getElementById('from-token-icon');
    const toTokenIcon = document.getElementById('to-token-icon');
    const inputAmount = document.getElementById('input-amount');
    const outputAmount = document.getElementById('output-amount');
    const errorMsg = document.getElementById('input-error');
    const inputRowClassList = inputAmount.parentElement.classList;
    const swapBtn = document.getElementById('swap-tokens-btn');
    const submitBtn = document.getElementById('submit-btn');
    const swapForm = document.getElementById('swap-form');
    const rateDetails = document.getElementById('exchange-rate-details');
    const successOverlay = document.getElementById('success-overlay');
    const closeSuccessBtn = document.getElementById('close-success');
    const successMsg = document.getElementById('success-message');

    const tokenIconBaseUrl = "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

    let prices = {};
    let tokenList = [];

    // Fetch token prices
    async function fetchPrices() {
        try {
            const response = await fetch('https://interview.switcheo.com/prices.json');
            const data = await response.json();

            // Process data: remove duplicates, taking the one with the latest date or just the first valid one
            // The instruction just says use prices.json
            data.forEach(item => {
                if (!prices[item.currency]) {
                    prices[item.currency] = item.price;
                    tokenList.push(item.currency);
                }
            });

            // Sort alphabetically
            tokenList.sort();
            populateSelects();

            // Set defaults if available
            if (tokenList.includes('ETH')) fromTokenSelect.value = 'ETH';
            else if (tokenList.length > 0) fromTokenSelect.value = tokenList[0];

            if (tokenList.includes('USDC')) toTokenSelect.value = 'USDC';
            else if (tokenList.length > 1) toTokenSelect.value = tokenList[1];

            updateIcons();
            updateExchangeRate();
            checkSubmitState();

        } catch (err) {
            console.error("Failed to fetch prices:", err);
            rateDetails.innerHTML = "<span style='color:var(--error)'>Failed to load prices. Please refresh.</span>";
        }
    }

    function populateSelects() {
        tokenList.forEach(token => {
            const option1 = document.createElement('option');
            option1.value = option1.text = token;
            fromTokenSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = option2.text = token;
            toTokenSelect.appendChild(option2);
        });
    }

    function iconErrorHandler(imgElement) {
        // If SVG fails to load, hide image and show generic block if we wanted, 
        // but Switcheo's repo has a Generic icon or we just hide it
        imgElement.style.display = 'none';
    }

    fromTokenIcon.addEventListener('error', () => iconErrorHandler(fromTokenIcon));
    toTokenIcon.addEventListener('error', () => iconErrorHandler(toTokenIcon));

    function updateIcons() {
        const fromSymbol = fromTokenSelect.value;
        const toSymbol = toTokenSelect.value;

        if (fromSymbol) {
            fromTokenIcon.src = `${tokenIconBaseUrl}${fromSymbol}.svg`;
            fromTokenIcon.style.display = 'block';
        } else {
            fromTokenIcon.style.display = 'none';
        }

        if (toSymbol) {
            toTokenIcon.src = `${tokenIconBaseUrl}${toSymbol}.svg`;
            toTokenIcon.style.display = 'block';
        } else {
            toTokenIcon.style.display = 'none';
        }
    }

    function formatNumber(num) {
        if (!num && num !== 0) return '';
        return Number(num.toPrecision(6)).toString(); // Basic formatting to prevent extremely long decimals
    }

    function calculateOutput() {
        const amountIn = parseFloat(inputAmount.value);
        const fromSymbol = fromTokenSelect.value;
        const toSymbol = toTokenSelect.value;

        if (isNaN(amountIn) || amountIn <= 0) {
            outputAmount.value = '';
            return;
        }

        if (!fromSymbol || !toSymbol || !prices[fromSymbol] || !prices[toSymbol]) {
            outputAmount.value = '';
            return;
        }

        // Calculation: (amount * fromPrice) / toPrice
        const fromPrice = prices[fromSymbol];
        const toPrice = prices[toSymbol];
        const amountOut = (amountIn * fromPrice) / toPrice;

        outputAmount.value = formatNumber(amountOut);
    }

    function updateExchangeRate() {
        const fromSymbol = fromTokenSelect.value;
        const toSymbol = toTokenSelect.value;

        if (fromSymbol && toSymbol && prices[fromSymbol] && prices[toSymbol]) {
            const rate = prices[fromSymbol] / prices[toSymbol];
            rateDetails.innerHTML = `<span>1 ${fromSymbol} = ${formatNumber(rate)} ${toSymbol}</span>`;
        } else {
            rateDetails.innerHTML = '';
        }
    }

    function validateInput() {
        const amountIn = parseFloat(inputAmount.value);
        if (!inputAmount.value) {
            showError('');
            inputRowClassList.remove('error');
            return false;
        }

        if (isNaN(amountIn) || amountIn <= 0) {
            showError('Enter a valid positive amount');
            inputRowClassList.add('error');
            return false;
        }

        const fromSymbol = fromTokenSelect.value;
        const toSymbol = toTokenSelect.value;

        if (!fromSymbol || !toSymbol) {
            showError('Select tokens to swap');
            inputRowClassList.add('error');
            return false;
        }

        if (fromSymbol === toSymbol) {
            showError('Cannot swap the same token');
            inputRowClassList.add('error');
            return false;
        }

        showError('');
        inputRowClassList.remove('error');
        return true;
    }

    function showError(msg) {
        if (msg) {
            errorMsg.textContent = msg;
            errorMsg.classList.add('visible');
        } else {
            errorMsg.classList.remove('visible');
        }
    }

    function checkSubmitState() {
        const amountIn = parseFloat(inputAmount.value);
        if (!isNaN(amountIn) && amountIn > 0 && fromTokenSelect.value && toTokenSelect.value && fromTokenSelect.value !== toTokenSelect.value) {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = "Swap";
        } else {
            submitBtn.disabled = true;
            if (!fromTokenSelect.value || !toTokenSelect.value) {
                submitBtn.querySelector('.btn-text').textContent = "Select a token";
            } else if (fromTokenSelect.value === toTokenSelect.value) {
                submitBtn.querySelector('.btn-text').textContent = "Same token selected";
            } else {
                submitBtn.querySelector('.btn-text').textContent = "Enter an amount";
            }
        }
    }

    // Event Listeners
    inputAmount.addEventListener('input', () => {
        validateInput();
        calculateOutput();
        checkSubmitState();
    });

    fromTokenSelect.addEventListener('change', () => {
        updateIcons();
        validateInput();
        calculateOutput();
        updateExchangeRate();
        checkSubmitState();
    });

    toTokenSelect.addEventListener('change', () => {
        updateIcons();
        validateInput();
        calculateOutput();
        updateExchangeRate();
        checkSubmitState();
    });

    swapBtn.addEventListener('click', () => {
        const temp = fromTokenSelect.value;
        fromTokenSelect.value = toTokenSelect.value;
        toTokenSelect.value = temp;

        updateIcons();
        validateInput();
        calculateOutput();
        updateExchangeRate();
        checkSubmitState();
    });

    swapForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!validateInput()) return;

        // Simulate swap logic
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.classList.remove('loading');

            // Show success
            const outVal = outputAmount.value;
            const amountIn = inputAmount.value;
            successMsg.textContent = `Successfully swapped ${amountIn} ${fromTokenSelect.value} to ${outVal} ${toTokenSelect.value}.`;
            successOverlay.classList.remove('hidden');

            // Reset form visually
            inputAmount.value = '';
            outputAmount.value = '';
            validateInput();
            checkSubmitState();

        }, 2000);
    });

    closeSuccessBtn.addEventListener('click', () => {
        successOverlay.classList.add('hidden');
    });

    // Init
    fetchPrices();
});
