import React from 'react';
import '../styles/Table.css';

const Table = ({ columns, data, actions }) => {
  return (
    <table className="app-table">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.header}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td key={`${row.id}-${column.key}`} data-label={column.header}>
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
            {actions && (
              <td className="action-buttons" data-label="Actions">
                {actions(row)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;