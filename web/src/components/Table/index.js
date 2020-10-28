import React from 'react';
import {useTable} from 'react-table';
import PropTypes from 'prop-types';
import {Table as TableBS} from 'react-bootstrap';

const Table = props => {
  const {data: propsData, columns: propsCol} = props;
  // eslint-disable-next-line
  const data = React.useMemo(() => propsData, [propsData]);
  // eslint-disable-next-line
  const columns = React.useMemo(() => propsCol, [propsCol]);
  const tableInstance = useTable({columns, data});

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return data.length === 0 ? (
    <p>No results for the selected table</p>
  ) : (
    <TableBS striped hover {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </TableBS>
  );
};

Table.propTypes = {
  columns: PropTypes.instanceOf(Array).isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
};

export default Table;
