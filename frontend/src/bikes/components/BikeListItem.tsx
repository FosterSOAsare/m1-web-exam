import {
  DeleteOutlined,
  EyeOutlined,
  ShoppingOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Space } from "antd";
import { ButtonLink } from "../../shared/components/ButtonLink";
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
      <Col span={9}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <ShoppingOutlined />
          {`${bike.brand} ${bike.model}`}
          {bike.electric && <ThunderboltOutlined aria-label="Electric" />}
        </Space>
      </Col>
      <Col span={5}>
        <Space orientation="horizontal" style={{ width: "100%" }}>
          <TagOutlined />
          {bike.category}
        </Space>
      </Col>
      <Col span={4}>{bike.frameMaterial}</Col>
      <Col
        span={4}
        style={{ textAlign: "right", fontWeight: "bold", paddingRight: "1.5rem" }}
      >
        {formatPrice(bike.priceCents)}
      </Col>
      <Col span={2}>
        <Row gutter={[4, 4]}>
          <Col>
            <ButtonLink to={`/bikes/$bikeId`} params={{ bikeId: bike.id }}>
              <EyeOutlined />
            </ButtonLink>
          </Col>
          <Col>
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Col>
        </Row>
      </Col>
    </ListItem>
  );
};
