import { ThunderboltOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import { Card, Descriptions, Skeleton, Space } from "antd";
import type { ReactNode } from "react";
import type { BikeModel } from "../models/BikeModel";

interface BikeSpecificationsCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
}

export const BikeSpecificationsCard = ({
  bike,
  isLoading,
}: BikeSpecificationsCardProps) => {
  const value = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    {
      key: "frameMaterial",
      label: "Frame material",
      children: value(bike?.frameMaterial),
    },
    {
      key: "frameSizeCm",
      label: "Frame size",
      children: value(bike && `${bike.frameSizeCm} cm`),
    },
    {
      key: "wheelSizeInches",
      label: "Wheel size",
      children: value(bike && `${bike.wheelSizeInches} in`),
    },
    { key: "gearCount", label: "Gears", children: value(bike?.gearCount) },
    {
      key: "weightKg",
      label: "Weight",
      children: value(bike && `${bike.weightKg} kg`),
    },
    {
      key: "electric",
      label: (
        <Space>
          <ThunderboltOutlined />
          Electric
        </Space>
      ),
      children: value(bike && (bike.electric ? "Yes" : "No")),
    },
  ];

  return (
    <Card title="Specifications" style={{ height: "100%" }}>
      <Descriptions column={1} items={items} />
    </Card>
  );
};
