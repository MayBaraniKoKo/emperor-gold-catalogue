import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import logoUrl from "@/assets/United42.jpg";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
};

type Order = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  address: string;
  note?: string;
  items: OrderItem[];
  total: number;
  status?: string;
  remark?: string;
  debit_money?: number;
};

type BillViewProps = {
  order: Order;
  onClose: () => void;
  onPrint: () => void;
};

const BillView = ({ order, onClose, onPrint }: BillViewProps) => {
  const invoiceDate = new Date(order.created_at);
  const invoiceNumber = order.id.slice(0, 8).toUpperCase();

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const debitAmount = order.debit_money || 0;
  const finalTotal = subtotal - debitAmount;

  const handlePrint = () => {
    // Create a new window with only the bill content
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const billHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          @page {
            margin: 0 !important;
            padding: 0 !important;
            padding-top: 50px !important;
            padding-left: 50px !important;
            padding-right: 50px !important;
            size: A4;
            font-color: white;
          }
          @media print {
            html::before,
            html::after,
            body::before,
            body::after {
              content: "" !important;
            }
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            width: 100%;
            height: 100%;
          }
          body {
            background: white;
            color: #000;
            font-family: system-ui, -apple-system, sans-serif;
            padding: 40px;
            width: 100%;
          }
          .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          .logo-section {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
          }
          .logo-section img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
          .company-info h1 {
            font-size: 32px;
            font-weight: bold;
            color: #b8860b;
          }
          .company-info p {
            font-size: 14px;
            color: #666;
          }
          .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
          }
          .invoice-details h3 {
            font-size: 12px;
            font-weight: 600;
            color: #999;
            margin-bottom: 10px;
          }
          .invoice-details p {
            font-size: 13px;
            line-height: 1.6;
          }
          .customer-info {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 30px;
          }
          .customer-info h3 {
            font-size: 12px;
            font-weight: 600;
            color: #999;
            margin-bottom: 15px;
          }
          .customer-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .customer-col p {
            font-size: 13px;
            line-height: 1.8;
            margin-bottom: 5px;
          }
          .customer-col strong {
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          th {
            border-bottom: 2px solid #000;
            padding: 12px 8px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
          }
          td {
            border-bottom: 1px solid #ddd;
            padding: 12px 8px;
            font-size: 13px;
          }
          .text-center {
            text-align: center;
          }
          .text-right {
            text-align: right;
          }
          .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
          }
          .totals-section {
            width: 400px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
          }
          .total-final {
            display: flex;
            justify-content: space-between;
            padding: 15px 12px;
            background: #b8860b;
            color: white;
            font-weight: 600;
            font-size: 16px;
            border-radius: 4px;
            margin-top: 10px;
          }
          .debit {
            color: #ff8800;
          }
          .remarks {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 30px;
            font-size: 13px;
          }
          .remarks strong {
            color: #1976d2;
          }
          .footer {
            border-top: 2px solid #000;
            padding-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body {
              padding: 0;
            }
            .invoice-container {
              margin: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <!-- Header -->
          <div class="header">
            <div class="logo-section">
              <img src="${logoUrl}" alt="United 42 logo" />
              <div class="company-info">
                <h1>UNITED 42</h1>
                <p>Premium Spirits & Beverages</p>
              </div>
            </div>
          </div>

          <!-- Invoice Details -->
          <div class="invoice-details">
            <div>
              <h3>INVOICE FROM:</h3>
              <p><strong>United 42 Ltd</strong></p>
              <p>Premium Spirits Retailer</p>
              <p>Contact: united424242@gmail.com</p>
            </div>
            <div style="text-align: right;">
              <h3>INVOICE DETAILS:</h3>
              <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
              <p><strong>Invoice Date:</strong> ${format(invoiceDate, "dd MMMM yyyy")}</p>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="customer-info">
            <h3>BILL TO:</h3>
            <div class="customer-row">
              <div class="customer-col">
                <p><strong>${order.name}</strong></p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}</p>
              </div>
              ${order.note ? `<div class="customer-col"><p><strong>Special Instructions:</strong></p><p><em>${order.note}</em></p></div>` : ""}
            </div>
          </div>

          <!-- Items Table -->
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="text-center" style="width: 80px;">Qty</th>
                <th class="text-right" style="width: 100px;">Unit Price</th>
                <th class="text-right" style="width: 120px;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item) => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">$${Number(item.price).toFixed(2)}</td>
                  <td class="text-right"><strong>$${(item.price * item.quantity).toFixed(2)}</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals">
            <div class="totals-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span><strong>$${subtotal.toFixed(2)}</strong></span>
              </div>
              ${debitAmount > 0 ? `
                <div class="total-row debit">
                  <span>Debit Amount:</span>
                  <span><strong>-$${debitAmount.toFixed(2)}</strong></span>
                </div>
              ` : ""}
              <div class="total-final">
                <span>Total Amount Due:</span>
                <span>$${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Remarks -->
          ${order.remark ? `
            <div class="remarks">
              <strong>Remarks:</strong> ${order.remark}
            </div>
          ` : ""}

          <!-- Footer -->
          <div class="footer">
            <p>Thank you for your order!</p>
            <p>For inquiries, please contact us at 09 88171 42 42, 09 761 42 42 42, 09 978 42 42 42</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(billHTML);
    printWindow.document.close();
  };

  return (
    <>
      {/* Print styles - More aggressive */}
      <style>{`
        @media print {
          * {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          
          html {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          /* Hide all fixed positioning wrappers */
          div[class*="fixed"] {
            position: static !important;
            inset: auto !important;
            background: transparent !important;
          }
          
          /* Hide dark mode and black backgrounds */
          .bg-black,
          .bg-black\/50,
          [class*="bg-black"] {
            display: none !important;
            background: transparent !important;
          }
          
          /* Keep only the print container */
          .print-container {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            position: static !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            background: white !important;
            border-radius: 0 !important;
            overflow: visible !important;
            max-height: none !important;
          }
          
          /* Hide CMS header */
          .no-print {
            display: none !important;
          }
          
          /* Force white backgrounds */
          [class*="bg-white"],
          [class*="bg-slate"],
          [class*="dark:bg"] {
            background: white !important;
            color: black !important;
          }
          
          /* Remove styling */
          .shadow-xl,
          .shadow,
          [class*="shadow"] {
            box-shadow: none !important;
          }
          
          .rounded-lg,
          .rounded,
          [class*="rounded"] {
            border-radius: 0 !important;
          }
          
          .p-4, .p-8 {
            padding: 20px !important;
          }
          
          /* Flex containers */
          .flex {
            display: flex !important;
          }
          
          .grid {
            display: grid !important;
          }
          
          .text-center {
            text-align: center !important;
          }
          
          .text-right {
            text-align: right !important;
          }
          
          .text-left {
            text-align: left !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-950 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto print-container">
          {/* Header - Hide on print */}
          <div className="sticky top-0 bg-white dark:bg-slate-950 border-b flex items-center justify-between p-4 no-print">
            <h2 className="font-display text-xl font-semibold">Invoice</h2>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="default">
                Print / Save as PDF
              </Button>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>

          {/* Bill Content */}
          <div className="p-12 print:p-0">

          {/* Company Header with Logo */}
          <div className="text-center mb-8 pb-4 border-b-2">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src={logoUrl} alt="United 42 logo" className="w-16 h-16 rounded-full object-cover shadow-gold" />
              <div>
                <h1 className="font-display text-3xl font-bold text-gold-gradient">UNITED 42</h1>
                <p className="text-muted-foreground text-sm">Premium Spirits & Beverages</p>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">INVOICE FROM:</h3>
              <div className="text-sm space-y-1">
                <p className="font-semibold">United 42 Ltd</p>
                <p>Premium Spirits Retailer</p>
                <p>Contact: united424242@gmail.com</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">INVOICE DETAILS:</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Invoice Number:</strong> {invoiceNumber}
                </p>
                <p>
                  <strong>Invoice Date:</strong> {format(invoiceDate, "dd MMMM yyyy")}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-secondary/50 p-4 rounded mb-8">
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">BILL TO:</h3>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div>
                <p className="font-semibold text-foreground">{order.name}</p>
                <p className="text-muted-foreground mt-1">
                  <strong>Phone:</strong> {order.phone}
                </p>
                <p className="text-muted-foreground">
                  <strong>Address:</strong> {order.address}
                </p>
              </div>
              {order.note && (
                <div>
                  <p className="font-semibold mb-1">Special Instructions:</p>
                  <p className="text-muted-foreground italic">{order.note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 font-semibold">
                  <th className="text-left py-2 px-2">Description</th>
                  <th className="text-center py-2 px-2 w-20">Qty</th>
                  <th className="text-right py-2 px-2 w-24">Unit Price</th>
                  <th className="text-right py-2 px-2 w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-2">{item.name}</td>
                    <td className="text-center py-3 px-2">{item.quantity}</td>
                    <td className="text-right py-3 px-2">${Number(item.price).toFixed(2)}</td>
                    <td className="text-right py-3 px-2 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full max-w-sm">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {debitAmount > 0 && (
                  <div className="flex justify-between py-2 border-b text-orange-600">
                    <span>Debit Amount:</span>
                    <span className="font-semibold">-${debitAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-3 px-3 bg-gold-gradient rounded font-semibold text-primary-foreground text-base">
                  <span>Total Amount Due:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Remark */}
          {order.remark && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded mb-8 text-sm">
              <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Remarks:</p>
              <p className="text-blue-800 dark:text-blue-200">{order.remark}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t-2 pt-6 text-center text-xs text-muted-foreground space-y-2">
            <p>Thank you for your order!</p>
            <p>For inquiries, please contact us at 09 88171 4242, 09 761 424242, 09 978 424242</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BillView;
