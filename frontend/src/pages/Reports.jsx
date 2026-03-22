import React, { useState } from 'react';
import ReportTable from '../components/Reports/ReportTable';
import { FileText } from 'lucide-react';
import '../sass/Reports.scss';

const REPORT_TYPES = [
  'Income Statement',
  'Balance Sheet', 
  'Cash Flow Statement',
  'Tax Summary',
  'Expense Report',
];

const PERIODS = [
  'Current Month',
  'Last Month',
  'Current Quarter',
  'Last Quarter',
  'Current Year',
  'Last Year',
];

const FORMATS = ['PDF', 'Excel', 'CSV'];

const Reports = () => {
  const [form, setForm] = useState({
    reportType: 'Income Statement',
    period: 'Current Month',
    format: 'PDF',
  });

  const [reports, setReports] = useState([
    { name: 'Income Statement', period: 'Current Month', format: 'PDF' }
  ]);

  const handleGenerate = () => {
    const newReport = {
      name: form.reportType,
      period: form.period,
      format: form.format,
    };
    setReports(prev => [...prev, newReport]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = reports.map(r =>
      `${r.name} | ${r.period} | ${r.format}`
    ).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report.${form.format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <h1>Financial Reports</h1>

      {/* Generate Report Form */}
      <div className="reports-section">
        <h2>Generate Report</h2>
        <div className="report-form">
          <div className="form-group">
            <label>Report Type</label>
            <select
              value={form.reportType}
              onChange={e => setForm({ ...form, reportType: e.target.value })}
            >
              {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Period</label>
            <select
              value={form.period}
              onChange={e => setForm({ ...form, period: e.target.value })}
            >
              {PERIODS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Format</label>
            <select
              value={form.format}
              onChange={e => setForm({ ...form, format: e.target.value })}
            >
              {FORMATS.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          <button className="btn-generate" onClick={handleGenerate}>
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Table */}
      <div className="reports-section">
        <h2>Generate Report</h2>
        <ReportTable reports={reports} />
      </div>

      {/* Report Preview */}
      <div className="reports-section report-preview">
        <h2>Report Preview</h2>
        <div className="preview-actions">
          <button className="btn-print" onClick={handlePrint}>Print</button>
          <button className="btn-download" onClick={handleDownload}>Download</button>
        </div>
        <div className="preview-box">
          <FileText size={40} color="#9ca3af" />
          <h3>Report Preview</h3>
          <p>Generated reports will appear here for review before downloading</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;