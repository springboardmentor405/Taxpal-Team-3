import React, { useState } from 'react';
import { FileText, Printer, Download, ChevronDown } from 'lucide-react';
import '../sass/Reports.scss';

const Reports = () => {
    const [reportType, setReportType] = useState('Income Statement');
    const [period, setPeriod] = useState('Current Month');
    const [format, setFormat] = useState('PDF');

    const generatedReports = [
        { name: 'Income Statement', period: 'Current Month', format: 'PDF', actions: '--' }
    ];

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
                                <option>CSV</option>
                                <option>Excel</option>
                            </select>
                            <ChevronDown className="select-icon" size={18} />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button className="btn-generate">Generate Report</button>
                    </div>
                </div>
            </section>

            <section className="reports-card reports-table-section">
                <h3>Generate Report</h3>
                <div className="table-responsive">
                    <table className="reports-table">
                        <thead>
                            <tr>
                                <th>Report Name</th>
                                <th>Generate</th>
                                <th>Format</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generatedReports.map((report, index) => (
                                <tr key={index}>
                                    <td>{report.name}</td>
                                    <td>{report.period}</td>
                                    <td>{report.format}</td>
                                    <td>{report.actions}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="reports-card report-preview-section">
                <div className="preview-header">
                    <h3>Report Preview</h3>
                    <div className="preview-actions">
                        <button className="btn-print">
                            <Printer size={18} />
                            Print
                        </button>
                        <button className="btn-download">
                            Download
                        </button>
                    </div>
                </div>
                <div className="preview-content">
                    <div className="empty-preview">
                        <FileText size={48} className="preview-icon" />
                        <h2>Report Preview</h2>
                        <p>Generated reports will appear here for review before downloading</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Reports;
