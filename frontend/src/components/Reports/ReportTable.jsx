import React from 'react';

const ReportTable = ({ reports }) => {
  return (
    <div className="report-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Generate</th>
            <th>Format</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#9ca3af' }}>
                No reports generated yet
              </td>
            </tr>
          ) : (
            reports.map((report, i) => (
              <tr key={i}>
                <td>{report.name}</td>
                <td>{report.period}</td>
                <td>{report.format}</td>
                <td>--</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;