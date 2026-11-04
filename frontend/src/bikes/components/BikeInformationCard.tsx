import type { DescriptionsProps } from "antd";
import { Card, Descriptions, Skeleton } from "antd";
import type { ReactNode } from "react";
import type { BikeModel } from "../models/BikeModel";

interface BikeInformationCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
}

const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });

export const BikeInformationCard = ({
  bike,
  isLoading,
}: BikeInformationCardProps) => {
  const value = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    { key: "brand", label: "Brand", children: value(bike?.brand) },
    { key: "model", label: "Model", children: value(bike?.model) },
    { key: "category", label: "Category", children: value(bike?.category) },
    {
      key: "price",
      label: "Price",
      children: value(bike && formatPrice(bike.priceCents)),
    },
    {
      key: "description",
      label: "Description",
      children: value(bike?.description),
    },
  ];

  return (
    <Card title="Bike information" style={{ height: "100%" }}>
      <Descriptions column={1} items={items} />
    </Card>
  );
};
