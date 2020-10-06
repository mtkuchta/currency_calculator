class CurrencyCalculator {
    constructor() {
        this.form = document.querySelector('.form');
        this.url = 'http://api.nbp.pl/api/exchangerates/rates/A/'
        this.inPLN = document.getElementById('inPLN');
        this.outEUR = document.getElementById('outEUR');
        this.outUSD = document.getElementById('outUSD');
        this.outPLN = document.getElementById('outPLN');
        this.selectIn = document.getElementById('currency');
        this.amountIn = document.getElementById('amount');
        this.value = 0;
        this.outPLN.disabled = true;

        this.selectIn.addEventListener('change', (e) => this.checkInput(e));
        this.form.addEventListener('submit', (e) => this.getData(e,
            this.form.elements.amount.value,
            this.form.elements.currencyIn.value,
            this.form.elements.currencyOut.value,
        ));

    }


    checkInput(e) {

        if (e.target.value === 'EUR' || e.target.value === 'USD') {
            this.outEUR.disabled = true;
            this.outUSD.disabled = true;
            this.outPLN.selected = true;
            this.outPLN.disabled = false;
        } else {
            this.outEUR.disabled = false;
            this.outUSD.disabled = false;
            this.outPLN.disabled = true;
            this.outPLN.selected = false;
        }
    }


    calculateValue(currencyIn, currencyOut, amount, rate) {
        if (currencyIn === 'PLN') {
            this.value = Math.round(amount / rate);
        } else {
            this.value = Math.round(amount * rate);

        }
        this.showResult(rate, currencyIn, currencyOut, this.value, amount)
    }

    getData(e, amount, currencyIn, currencyOut) {
        e.preventDefault();
        const amountIn = document.getElementById('amount');
        amountIn.value = '';
        if (currencyIn === 'PLN') {
            return fetch(`${this.url}/${currencyOut}`)
                .then(resp => resp.json())
                .then(json => {
                    const rate = json.rates[0].mid
                    this.calculateValue(currencyIn, currencyOut, amount, rate)
                })

        } else {
            return fetch(`${this.url}/${currencyIn}`)
                .then(resp => resp.json())
                .then(json => {
                    const rate = json.rates[0].mid
                    this.calculateValue(currencyIn, currencyOut, amount, rate)
                })
        }
    }

    showResult(rate, currencyIn, currencyOut, value, amount) {
        if (currencyIn === 'PLN') {
            const showRate = document.querySelector('h2.rate');
            const showResult = document.querySelector('h2.result');
            showRate.textContent = `Średni kurs ${currencyOut}: ${rate}`
            showResult.textContent = `${amount} ${currencyIn} = ${value} ${currencyOut}`
        } else {
            const showRate = document.querySelector('.rate');
            const showResult = document.querySelector('h2.result');
            showRate.textContent = `Średni kurs ${currencyIn}: ${rate}`
            showResult.textContent = `${amount} ${currencyIn} = ${value} ${currencyOut}`
        }
    }
}