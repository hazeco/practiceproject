import React from "react";

const ranges = [
  { label: "รายวัน", value: "day" },
  { label: "รายสัปดาห์", value: "week" },
  { label: "รายเดือน", value: "month" },
];

export default function ChartRangeSelector({ value, onChange }) {
  return (
    <nav className="tab-nav flex flex-row w-full md:w-auto mb-0 bg-gray-100 rounded-lg p-1 overflow-x-auto">
      {ranges.map((r, idx) => (
        <button
          key={r.value}
          className={`tab-btn px-4 py-1.5 font-medium border-b-2 transition focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 ${
            value === r.value
              ? "border-indigo-600 text-indigo-600 bg-white active"
              : "border-transparent text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
          }`}
          style={{ borderRadius: idx === 0 ? '0.5rem 0 0 0.5rem' : idx === ranges.length - 1 ? '0 0.5rem 0.5rem 0' : '0' }}
          onClick={() => onChange(r.value)}
          type="button"
          aria-current={value === r.value ? 'true' : undefined}
        >
          {r.label}
        </button>
      ))}
      <style>{`
        .tab-nav {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0;
          border-radius: 0.5rem;
          overflow: hidden;
          min-width: 220px;
        }
        .tab-btn {
          border: none;
          background: none;
          outline: none;
          margin: 0;
          border-bottom: 2px solid transparent;
          border-radius: 0;
          transition: color 0.2s, background 0.2s, border-color 0.2s;
        }
        .tab-btn[aria-current="true"],
        .tab-btn.active {
          border-bottom: 2px solid #4f46e5;
          color: #4f46e5;
          background: #fff;
        }
        .tab-btn:not(.active):hover {
          color: #4f46e5;
          background: #f5f7ff;
        }
        @media (max-width: 640px) {
          .tab-nav {
            flex-direction: row;
            width: 100%;
            min-width: 0;
          }
          .tab-btn {
            flex: 1 1 0;
            font-size: 0.95rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
}
