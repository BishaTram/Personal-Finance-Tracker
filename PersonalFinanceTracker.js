let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

document.getElementById('addTransaction').addEventListener('click', function() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description === '' || isNaN(amount)) {
        alert('Please enter valid description and amount.');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        type
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateUI();
    clearInputs();
});

function clearInputs() {
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
}

function updateUI() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
        const transactionDiv = document.createElement('div');
        transactionDiv.className = 'transaction';
        transactionDiv.innerHTML = `
            ${transaction.description}: $${transaction.amount} (${transaction.type})
            <button onclick="deleteTransaction(${transaction.id})">Delete</button>
        `;
        transactionList.appendChild(transactionDiv);

        if (transaction.type === 'income') {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });

    document.getElementById('totalIncome').innerText = totalIncome.toFixed(2);
    document.getElementById('totalExpenses').innerText = totalExpenses.toFixed(2);
    document.getElementById('balance').innerText = (totalIncome - totalExpenses).toFixed(2);
    updateChart(totalIncome, totalExpenses);
}

function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateUI();
}

function updateChart(totalIncome, totalExpenses) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Financial Overview',
                data: [totalIncome, totalExpenses],
                backgroundColor: ['#28a745', '#dc3545'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Initial UI update
updateUI();
