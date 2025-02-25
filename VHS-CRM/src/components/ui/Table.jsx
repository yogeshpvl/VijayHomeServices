import React from "react";

// Table Component
export const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableHeader key={col.key}>{col.label}</TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => (
                <TableCell key={col.key}>{row[col.key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
};

// Table Head Component
export const TableHead = ({ children }) => (
  <thead className="bg-gray-200">{children}</thead>
);

// Table Body Component
export const TableBody = ({ children }) => <tbody>{children}</tbody>;

// Table Row Component
export const TableRow = ({ children }) => (
  <tr className="even:bg-gray-50">{children}</tr>
);

// Table Header Component
export const TableHeader = ({ children }) => (
  <th className="p-2 text-left text-sm font-semibold text-gray-700 border">
    {children}
  </th>
);

// Table Cell Component
export const TableCell = ({ children }) => (
  <td className="p-2 text-sm text-gray-600 border">{children}</td>
);
