import React, { useState } from "react";
import {
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from "reactstrap";

const PaginatedTable = ({
  data,
  currentPage,
  pageSize = 10,
  fetchData = () => { },
  fields,
  actions = false,
  onEdit = null,
  onDelete = null,
}) => {
  const results = data.data ?? [];
  const count = data.total ?? 0;
  const totalPages = Math.ceil(count / pageSize);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results
            ? results.map((item, index) => (
              <tr key={index}>
                {fields.map((field, index) => (
                  <td key={index}>{item[field.key]}</td>
                ))}
                {actions ? (
                  <td style={{ width: "20%" }}>
                    <div className="d-flex align-items-centers justify-content-center">
                      {onEdit ? (
                        <Button
                          size="sm"
                          color="dark"
                          className="me-2"
                          onClick={() => onEdit(item._id)}
                        >
                          <i className="bi bi-pencil-square" />
                        </Button>
                      ) : null}
                      {onDelete ? (
                        <Button
                          size="sm"
                          color="danger"
                          className="me-2"
                          onClick={() => onDelete(item._id)}
                        >
                          <i className="bi bi-trash3-fill" />
                        </Button>
                      ) : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))
            : null}
        </tbody>
      </Table>

      <Pagination>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink previous onClick={() => fetchData(currentPage - 1)} />
        </PaginationItem>

        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index} active={index + 1 === currentPage}>
            <PaginationLink onClick={() => fetchData(index + 1)}>
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem
          disabled={currentPage === totalPages || results.length === 0}
        >
          <PaginationLink next onClick={() => fetchData(currentPage + 1)} />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default PaginatedTable;
