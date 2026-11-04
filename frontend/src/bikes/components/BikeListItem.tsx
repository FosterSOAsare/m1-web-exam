import {
  ShoppingOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Col, Space } from "antd";
import { ListItem } from "../../shared/components/ListItem";
import type { BikeModel } from "../models/BikeModel";

interface BikeListItemProps {
  bike: BikeModel;
}

const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });

export const BikeListItem = ({ bike }: BikeListItemProps) => {
  return (
    <ListItem>
      <Col span={10}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <ShoppingOutlined />
          {`${bike.brand} ${bike.model}`}
          {bike.electric && <ThunderboltOutlined aria-label="Electric" />}
        </Space>
      </Col>
      <Col span={6}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <TagOutlined />
          {bike.category}
        </Space>
      </Col>
      <Col span={4}>{bike.frameMaterial}</Col>
      <Col span={4} style={{ textAlign: "right", fontWeight: "bold" }}>
        {formatPrice(bike.priceCents)}
      </Col>
    </ListItem>
  );
};
