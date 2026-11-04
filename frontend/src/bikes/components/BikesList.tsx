import { Pagination, Row, Select, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { useBikesProvider } from "../providers/useBikesProvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

const limitOptions = [10, 15, 20, 25, 50].map((value) => ({
  value,
  label: `${value} / page`,
}));

export const BikesList = () => {
  const { bikes, totalCount, isLoading, load, createBike } = useBikesProvider();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    load(page, limit);
  }, [page, limit]);

  // The current page may not exist with the new limit, so go back to the first
  const onLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddBikeButton createBike={createBike} />
      {isLoading ? (
        <Skeleton />
      ) : (
        bikes.map((bike) => <BikeListItem key={bike.id} bike={bike} />)
      )}
      <Row
        justify="space-between"
        align="middle"
        style={{ padding: ".5rem", marginTop: "1rem" }}
      >
        <Select
          aria-label="Bikes per page"
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
