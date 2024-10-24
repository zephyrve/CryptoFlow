export const PdfTemplate = ({
                                category,
                                createdAt,
                                owner,
                                recipient,
                                items,
                                totalAmount,
                                status,
                                tags,
                                tokenAddress,
                                tokenName = '',
                                ownerName = '',
                                recipientName = ''
                            }: any) => `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }
            .invoice-container { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h1 { color: #d000ff; margin-bottom: 20px; }
            .header, .footer { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; color: #d000ff; text-align: right; }
            .badge {
                    display: inline-block;
                    background-color: #ffdbf8;
                    padding: 2px 3px; 
                    border-radius: 5px;
                    margin-right: 10px; 
                    
                    .success: {
                    background-color: #d0ffc7;
                    }
                }
                .badge strong {
                    margin-right: 5px; 
                }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <h1>Invoice</h1>
            <div class="header">
                    <div>
                        <strong>Sender:</strong> ${owner?.toUpperCase()} ${ownerName ? `<span class="badge" style="font-weight: 600">${ownerName}</span>` : ''}
                    </div>
                    <div>
                        <strong>Client:</strong> ${recipient?.toUpperCase()} ${recipientName ? `<span class="badge" style="font-weight: 600">${recipientName}</span>` : ''}
                    </div>                   
                     <div><strong>Token:</strong> ${tokenName !== '' ? `<span style="font-weight: 700; color: #d000ff">${tokenName}</span>` : tokenAddress}</div>
                    <div><strong>Created At:</strong> ${new Date(createdAt).toLocaleDateString()}</div>
                    <div><strong>Category:</strong> ${category ? category : ''}</div>
                    <div><strong>Tags:</strong> ${tags ? tags : ''}</div>
                    <div><strong>Status:</strong> <span class="badge">${status}</span></div>
                </div>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>QTY</th>
                        <th>Unit Price ${tokenName !== '' ? `(${tokenName})` : ''}</th>
                        <th>Discount (%)</th>
                        <th>Tax (%)</th>
                        <th>Amount ${tokenName !== '' ? `(${tokenName})` : ''}</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map((item: any) => `
                        <tr>
                            <td>${item.description || ''}</td>
                            <td>${item.qty}</td>
                            <td>${item.unitPrice}</td>
                            <td>${item.discount}</td>
                            <td>${item.tax}</td>
                            <td>${item.totalAmount}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="footer">
                <div class="total">Total Amount: ${totalAmount} ${tokenName !== '' ? tokenName : ''}</div>
            </div>
        </div>
    </body>
    </html>`;