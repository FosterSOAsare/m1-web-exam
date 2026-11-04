import { Pagination, Row, Select, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { useCustomersProvider } from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

const limitOptions = [10, 15, 20, 25,  50].map((value) => ({
  value,
  label: `${value} / page`,
}));

export const CustomersList = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const {
    customers,
    totalCount,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
  } = useCustomersProvider(page, limit);

  useEffect(() => {
    load();
  }, [page, limit]);

  // The current page may not exist with the new limit, so go back to the first
  const onLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton createCustomer={createCustomer} />
      {isLoading ? (
        <Skeleton />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={deleteCustomer}
          />
        ))
      )}
      <Row
        justify="space-between"
        align="middle"
        style={{ padding: ".5rem", marginTop: "1rem" }}
      >
        <Select
          aria-label="Customers per page"
          value={limit}
          options={limitOptions}
          disabled={isLoading}
          onChange={onLimitChange}
        />
        <Pagination
          current={page}
          pageSize={limit}
          total={totalCount}
          showSizeChanger={false}
          disabled={isLoading}
          onChange={setPage}
        />
      </Row>
    </Space>
  );
};
