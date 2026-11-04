import { ArrowLeftOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Col, Row, Skeleton, Space } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect } from "react";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import { BikeInformationCard } from "./BikeInformationCard";
import { BikeSpecificationsCard } from "./BikeSpecificationsCard";

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load } = useBikeDetailsProvider(bikeId);

  useEffect(() => {
    load();
  }, [bikeId]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center">
        <ShoppingOutlined style={{ fontSize: "1.5rem" }} />
        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Title level={2} style={{ margin: 0 }}>
            {bike ? `${bike.brand} ${bike.model}` : "Bike not found"}
          </Title>
        )}
      </Space>

      <Row gutter={[16, 16]} style={{ alignSelf: "stretch" }}>
        <Col xs={24} md={12}>
          <BikeInformationCard bike={bike} isLoading={isLoading} />
        </Col>
        <Col xs={24} md={12}>
          <BikeSpecificationsCard bike={bike} isLoading={isLoading} />
        </Col>
      </Row>
    </div>
  );
};
