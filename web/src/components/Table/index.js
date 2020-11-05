import React from 'react';
import {useTable, usePagination} from 'react-table';
import PropTypes from 'prop-types';
import {Table as TableBS} from 'react-bootstrap';
import style from './Table.module.css';

const Table = props => {
  const {data: propsData, columns: propsCol} = props;
  // eslint-disable-next-line
  const data = React.useMemo(() => propsData, [propsData]);
  // eslint-disable-next-line
  const columns = React.useMemo(() => propsCol, [propsCol]);
  const tableInstance = useTable(
    {columns, data, initialState: {pageIndex: 0}},
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,

    // Pagination stuff
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = tableInstance;

  return data.length === 0 ? (
    <p>No results for the selected table</p>
  ) : (
    <div className={style.table_container}>
      <TableBS striped hover {...getTableProps()} className="table-bordered">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} className={style.th}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
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
      <div className={style.pagination_bar}>
        <button
          type="button"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button
          type="button"
          onClick={() => nextPage()}
          disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          className={style.pagination_bar_last}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}>
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.instanceOf(Array).isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
};

export default Table;
