const socket = io();
let expiryInterval;
let html5QrcodeScanner = null;

document.getElementById('createInvoiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    const receiverName = document.getElementById('receiverName').value;
    const description = `Payment to ${receiverName}`;

    try {
        const response = await fetch('/api/create-invoice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                amount: parseInt(amount), 
                memo: description,
                receiverName 
            })
        });

        const invoice = await response.json();
        if (invoice.error) throw new Error(invoice.error);

        displayInvoice(invoice, receiverName);
        startExpiryTimer(invoice.expires_at);
        
        socket.emit('watchInvoice', { id: invoice.id });
    } catch (error) {
        showToast(error.message, 'error');
    }
});

document.getElementById('payInvoiceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const paymentRequest = document.getElementById('paymentRequestInput').value;

    try {
        const response = await fetch('/api/send-bitcoin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentRequest })
        });

        const result = await response.json();
        if (result.error) throw new Error(result.error);

        showToast('Payment sent successfully!', 'success');
        document.getElementById('payInvoiceForm').reset();
        stopQRScanner();
    } catch (error) {
        showToast(error.message, 'error');
    }
});

document.getElementById('copyButton').addEventListener('click', () => {
    const paymentRequest = document.getElementById('paymentRequest').textContent;
    navigator.clipboard.writeText(paymentRequest)
        .then(() => showToast('Payment request copied!', 'success'))
        .catch(err => showToast('Failed to copy payment request', 'error'));
});

document.getElementById('startScan').addEventListener('click', () => {
    const qrReader = document.getElementById('qr-reader');
    if (qrReader.style.display === 'none') {
        startQRScanner();
        qrReader.style.display = 'block';
        document.getElementById('startScan').textContent = '❌ Stop Scanner';
    } else {
        stopQRScanner();
        qrReader.style.display = 'none';
        document.getElementById('startScan').textContent = '📷 Scan QR Code';
    }
});

function startQRScanner() {
    if (html5QrcodeScanner) {
        stopQRScanner();
    }

    html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { 
        fps: 10,
        qrbox: { width: 250, height: 250 }
    });

    html5QrcodeScanner.render((decodedText) => {
        document.getElementById('paymentRequestInput').value = decodedText;
        showToast('QR code scanned successfully!', 'success');
        stopQRScanner();
        document.getElementById('qr-reader').style.display = 'none';
        document.getElementById('startScan').textContent = '📷 Scan QR Code';
    }, (error) => {
        // Handle errors silently
    });
}

function stopQRScanner() {
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear();
        html5QrcodeScanner = null;
    }
}

socket.on('invoicePaid', (data) => {
    showToast(`Invoice paid: ${data.amount} sats`, 'success');
    clearInterval(expiryInterval);
    document.getElementById('invoiceDetails').style.display = 'none';
});

socket.on('invoiceExpired', () => {
    showToast('Invoice expired', 'error');
    clearInterval(expiryInterval);
    document.getElementById('invoiceDetails').style.display = 'none';
});

function displayInvoice(invoice, receiverName) {
    const invoiceDetails = document.getElementById('invoiceDetails');
    const qrcodeElement = document.getElementById('qrcode');
    const paymentRequestElement = document.getElementById('paymentRequest');
    const receiverInfoElement = document.getElementById('receiverInfo');

    // Display QR code using the data URL from the server
    qrcodeElement.innerHTML = `<img src="${invoice.qrCode}" alt="QR Code" style="max-width: 100%; height: auto;">`;
    
    paymentRequestElement.textContent = invoice.request;
    receiverInfoElement.textContent = `Payment to: ${receiverName}`;
    invoiceDetails.style.display = 'block';
}

function startExpiryTimer(expiryDate) {
    clearInterval(expiryInterval);
    const expiryElement = document.getElementById('expiryTimer');

    expiryInterval = setInterval(() => {
        const timeLeft = new Date(expiryDate) - new Date();
        if (timeLeft <= 0) {
            clearInterval(expiryInterval);
            expiryElement.textContent = 'Expired';
            return;
        }

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        expiryElement.textContent = `Expires in: ${minutes}m ${seconds}s`;
    }, 1000);
}

function showToast(message, type) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'error' ? '#ff4444' : '#00C851',
    }).showToast();
}