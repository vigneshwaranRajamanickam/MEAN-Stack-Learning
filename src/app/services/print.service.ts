import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PrintService {

    constructor() { }

    printReceipt(receiptData: any) {
        const { storeName, storeAddress, customerName, items, totalAmount, date, invoiceNumber } = receiptData;

        // Generate Items HTML
        const itemsHtml = items.map((item: any) => `
        <div class="receipt-item">
            <span>${item.name} x${item.quantity || 1}</span>
            <span>₹${(item.price * (item.quantity || 1)).toFixed(2)}</span>
        </div>
    `).join('');

        // Generate Date String
        const dateStr = date instanceof Date ? date.toLocaleString() : new Date(date).toLocaleString();

        const printContent = `
        <div class="receipt-header">
            <h2>${storeName}</h2>
            ${storeAddress ? `<p>${storeAddress}</p>` : ''}
            <p>Invoice #: ${invoiceNumber || 'N/A'}</p>
            <p>Date: ${dateStr}</p>
            ${customerName ? `<p>Customer: ${customerName}</p>` : ''}
        </div>
        <div class="receipt-items">
            ${itemsHtml}
        </div>
        <div class="receipt-total">
            <h3>Total: ₹${Number(totalAmount).toFixed(2)}</h3>
        </div>
        <div class="receipt-footer">
            <p>Thank you for shopping with us!</p>
        </div>
        <div class="barcode">||| || ||| || ||||</div>
    `;

        const win = window.open('', '', 'height=700,width=500');
        if (win) {
            win.document.write(`
            <html>
            <head>
                <title>Receipt</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
                    body {
                        font-family: 'VT323', 'Courier New', monospace;
                        width: 80mm;
                        margin: 0 auto;
                        padding: 10px;
                        color: #000;
                    }
                    .receipt-header {
                        text-align: center;
                        border-bottom: 2px dashed #000;
                        padding-bottom: 10px;
                        margin-bottom: 10px;
                    }
                    .receipt-header h2 {
                        margin: 0;
                        font-size: 24px;
                        text-transform: uppercase;
                    }
                    .receipt-header p {
                        margin: 2px 0;
                        font-size: 14px;
                    }
                    .receipt-items {
                        border-bottom: 2px dashed #000;
                        padding-bottom: 10px;
                        margin-bottom: 10px;
                    }
                    .receipt-item {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                        font-size: 16px;
                    }
                    .receipt-total {
                        text-align: right;
                        font-size: 20px;
                        font-weight: bold;
                        border-bottom: 2px dashed #000;
                        padding-bottom: 10px;
                        margin-bottom: 10px;
                    }
                    .receipt-footer {
                        text-align: center;
                        font-size: 14px;
                        margin-top: 20px;
                    }
                    .barcode {
                        text-align: center;
                        margin-top: 15px;
                        font-family: 'Libre Barcode 39 Text', cursive;
                        font-size: 40px;
                    }
                </style>
            </head>
            <body>
                ${printContent}
            </body>
            </html>
        `);
            win.document.close();
            setTimeout(() => {
                win.print();
            }, 500);
        }
    }
}
