import React, { useState } from 'react';
import axios from 'axios';
import { FileText, ChevronDown } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../sass/Reports.scss';

const API_URL = (() => {
    const raw = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const base = String(raw).replace(/\/+$/, "");
    return base.endsWith("/api") ? base : `${base}/api`;
})();

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

const fmt = (n) =>
    `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const fmtPDF = (n) =>
    `Rs. ${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const Reports = () => {
    const [reportType, setReportType] = useState('Income Statement');
    const [period, setPeriod] = useState('Current Month');
    const [format, setFormat] = useState('PDF');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`${API_URL}/reports`, {
                ...getAuthHeaders(),
                params: { reportType, period },
            });
            setReportData(res.data);
        } catch (err) {
            console.error('Failed to generate report:', err);
            setError('Failed to generate report. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handleDownload = () => {
        if (!reportData) return;

        if (format === 'PDF') {
            exportToPDF();
        } else if (format === 'Excel') {
            exportToExcel();
        } else {
            // Fallback for .txt download
            const lines = [
                `Report: ${reportData.reportType}`,
                `Period: ${reportData.period}`,
                ``,
                `SUMMARY`,
                `Total Income: ${fmt(reportData.summary.totalIncome)}`,
                `Total Expense: ${fmt(reportData.summary.totalExpense)}`,
                `Net Balance: ${fmt(reportData.summary.netBalance)}`,
                `Total Transactions: ${reportData.summary.totalTransactions}`,
                ``,
                `TRANSACTIONS`,
                ...reportData.transactions.map(
                    (t) =>
                        `  ${new Date(t.date).toLocaleDateString()} | ${t.description || 'Untitled'} | ${t.type} | ${fmt(t.amount)} | ${t.category}`
                ),
            ];
            const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${reportData.reportType.replace(/\s+/g, '_')}_${reportData.period.replace(/\s+/g, '_')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            const date = new Date().toLocaleDateString();

            // Header - Solid Black Text
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.text('Financial Report', 14, 22);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(`Generated on: ${date}`, 14, 30);
            doc.text(`Report Type: ${reportData.reportType}`, 14, 36);
            doc.text(`Period: ${reportData.period}`, 14, 42);

            // Summary Table - Simple Grid
            autoTable(doc, {
                startY: 52,
                head: [['Total Income', 'Total Expenses', 'Net Balance', 'Transactions']],
                body: [[
                    fmtPDF(reportData.summary.totalIncome),
                    fmtPDF(reportData.summary.totalExpense),
                    fmtPDF(reportData.summary.netBalance),
                    reportData.summary.totalTransactions
                ]],
                theme: 'grid',
                headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 3 }
            });

            // Transactions Table - Simple Grid
            autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 12,
                head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
                body: reportData.transactions.map(t => [
                    new Date(t.date).toLocaleDateString(),
                    t.description || 'Untitled',
                    t.category,
                    t.type,
                    fmtPDF(t.amount)
                ]),
                theme: 'grid',
                headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
                styles: { fontSize: 9, cellPadding: 2 }
            });

            doc.save(`${reportData.reportType.replace(/\s+/g, '_')}.pdf`);
        } catch (e) {
            console.error('PDF Export Error:', e);
            setError('Failed to generate PDF. Make sure you have jspdf installed.');
        }
    };

    const exportToExcel = () => {
        try {
            // Prepare data
            const summary = [
                ['Category', 'Value'],
                ['Total Income', reportData.summary.totalIncome],
                ['Total Expense', reportData.summary.totalExpense],
                ['Net Balance', reportData.summary.netBalance],
                ['Transaction Count', reportData.summary.totalTransactions]
            ];

            const txs = reportData.transactions.map(t => ({
                Date: new Date(t.date).toLocaleDateString(),
                Description: t.description || 'Untitled',
                Category: t.category,
                Type: t.type,
                Amount: t.amount
            }));

            // Create Sheets
            const wb = XLSX.utils.book_new();
            const wsSummary = XLSX.utils.aoa_to_sheet(summary);
            const wsTxs = XLSX.utils.json_to_sheet(txs);

            // Append Sheets
            XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
            XLSX.utils.book_append_sheet(wb, wsTxs, 'Transactions');

            // Download
            XLSX.writeFile(wb, `${reportData.reportType.replace(/\s+/g, '_')}.xlsx`);
        } catch (e) {
            console.error('Excel Export Error:', e);
            setError('Failed to generate Excel file.');
        }
    };

    return (
        <div className="reports-page">
            <header className="reports-header">
                <h1>Financial Reports</h1>
            </header>

            <section className="reports-card generate-report-section">
                <h3>Generate Report</h3>
                <div className="report-form">
                    <div className="form-group">
                        <label>Report Type</label>
                        <div className="select-wrapper">
                            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                                <option>Income Statement</option>
                                <option>Balance Sheet</option>
                                <option>Cash Flow</option>
                            </select>
                            <ChevronDown className="select-icon" size={18} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Period</label>
                        <div className="select-wrapper">
                            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                                <option>Current Month</option>
                                <option>Last Month</option>
                                <option>Last Quarter</option>
                                <option>Year to Date</option>
                            </select>
                            <ChevronDown className="select-icon" size={18} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Format</label>
                        <div className="select-wrapper">
                            <select value={format} onChange={(e) => setFormat(e.target.value)}>
                                <option>PDF</option>
                                <option>Excel</option>
                            </select>
                            <ChevronDown className="select-icon" size={18} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn-generate" onClick={handleGenerate} disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>
                {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
            </section>

            {reportData && (
                <section className="reports-card reports-table-section">
                    <h3>Generated Reports</h3>
                    <div className="table-responsive">
                        <table className="reports-table">
                            <thead>
                                <tr>
                                    <th>Report Name</th>
                                    <th>Period</th>
                                    <th>Format</th>
                                    <th>Net Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{reportData.reportType}</td>
                                    <td>{reportData.period}</td>
                                    <td>{format}</td>
                                    <td style={{ color: reportData.summary.netBalance >= 0 ? 'green' : 'red' }}>
                                        {fmt(reportData.summary.netBalance)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            <section className="reports-card report-preview-section">
                <div className="preview-header">
                    <h3>Report Preview</h3>
                    <div className="preview-actions">
                        <button className="btn-download" onClick={handleDownload} disabled={!reportData}>
                            Download
                        </button>
                    </div>
                </div>
                <div className="preview-content">
                    {!reportData ? (
                        <div className="empty-preview">
                            <FileText size={48} className="preview-icon" />
                            <h2>Report Preview</h2>
                            <p>Generated reports will appear here for review before downloading</p>
                        </div>
                    ) : (
                        <div className="report-preview-data">
                            <h2>{reportData.reportType} — {reportData.period}</h2>
                            <div className="report-summary-grid">
                                <div className="summary-item">
                                    <span className="summary-label">Total Income</span>
                                    <span className="summary-value income">{fmt(reportData.summary.totalIncome)}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Total Expense</span>
                                    <span className="summary-value expense">{fmt(reportData.summary.totalExpense)}</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Net Balance</span>
                                    <span className="summary-value" style={{ color: reportData.summary.netBalance >= 0 ? 'green' : 'red' }}>
                                        {fmt(reportData.summary.netBalance)}
                                    </span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Transactions</span>
                                    <span className="summary-value">{reportData.summary.totalTransactions}</span>
                                </div>
                            </div>

                            {Object.keys(reportData.incomeByCategory).length > 0 && (
                                <>
                                    <h4>Income by Category</h4>
                                    <table className="reports-table">
                                        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
                                        <tbody>
                                            {Object.entries(reportData.incomeByCategory).map(([cat, amt]) => (
                                                <tr key={cat}><td>{cat}</td><td style={{ color: 'green' }}>{fmt(amt)}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {Object.keys(reportData.expenseByCategory).length > 0 && (
                                <>
                                    <h4>Expense by Category</h4>
                                    <table className="reports-table">
                                        <thead><tr><th>Category</th><th>Amount</th></tr></thead>
                                        <tbody>
                                            {Object.entries(reportData.expenseByCategory).map(([cat, amt]) => (
                                                <tr key={cat}><td>{cat}</td><td style={{ color: 'red' }}>{fmt(amt)}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {reportData.transactions.length > 0 && (
                                <>
                                    <h4>Transactions</h4>
                                    <table className="reports-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Type</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.transactions.map((t) => (
                                                <tr key={t._id}>
                                                    <td>{new Date(t.date).toLocaleDateString()}</td>
                                                    <td>{t.description || 'Untitled'}</td>
                                                    <td>{t.category}</td>
                                                    <td>{t.type}</td>
                                                    <td style={{ color: t.type === 'Income' ? 'green' : 'red' }}>
                                                        {t.type === 'Income' ? '+' : '-'}{fmt(t.amount)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {reportData.transactions.length === 0 && (
                                <p style={{ textAlign: 'center', color: '#888', marginTop: '1rem' }}>
                                    No transactions found for this period.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Reports;
