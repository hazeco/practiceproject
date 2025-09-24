import React from "react";

export default function ChartDatePicker({ range, year, month, onYearChange, onMonthChange }) {
  // year: number, month: 0-11
  const thisYear = new Date().getFullYear();
  const years = [];
  for (let y = thisYear; y >= thisYear - 5; y--) years.push(y);
  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];
  return (
    <div className="flex gap-2 items-center">
      <div className="relative">
        <select
          className="chart-btn-select"
          value={year}
          onChange={e => onYearChange(Number(e.target.value))}
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
          ▼
        </span>
      </div>
      {(range !== 'year') && (
        <div className="relative">
          <select
            className="chart-btn-select"
            value={month}
            onChange={e => onMonthChange(Number(e.target.value))}
            size={1}
          >
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
            ▼
          </span>
        </div>
      )}
      <style>{`
        .chart-btn-select {
          display: inline-block;
          min-width: 100px;
          max-width: 120px;
          height: 42px;
          padding: 0 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          font-size: 1rem;
          border: 1px solid #d1d5db;
          background: #fff;
          color: #374151;
          text-align: center;
          transition: border 0.2s, box-shadow 0.2s;
          box-shadow: 0 1px 2px 0 rgb(16 24 40 / 0.04);
          appearance: none;
        }
        .chart-btn-select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 2px #c7d2fe;
        }
        .chart-btn-select:hover {
          background: #f5f7ff;
        }
      `}</style>
    </div>
  );
}
