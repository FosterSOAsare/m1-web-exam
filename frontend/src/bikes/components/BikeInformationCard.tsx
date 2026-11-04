import { CloseOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Input,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";

interface BikeInformationCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
  updateBike: (input: UpdateBikeModel) => Promise<void>;
}

type BikeInformationValues = {
  brand: string;
  model: string;
  category: string;
  price: string;
  description: string;
};

type BikeInformationErrors = Partial<
  Record<keyof BikeInformationValues, string>
>;

const formatPrice = (cents: number) =>
  (cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
  });

const toValues = (bike: BikeModel): BikeInformationValues => ({
  brand: bike.brand,
  model: bike.model,
  category: bike.category,
  price: String(bike.priceCents / 100),
  description: bike.description,
});

const validate = (values: BikeInformationValues): BikeInformationErrors => {
  const errors: BikeInformationErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.category.trim()) errors.category = "Category is required";
  if (!values.price.trim()) errors.price = "Price is required";
  else if (Number(values.price) < 0) errors.price = "Price cannot be negative";
  if (!values.description.trim())
    errors.description = "Description is required";
  return errors;
};

export const BikeInformationCard = ({
  bike,
  isLoading,
  updateBike,
}: BikeInformationCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeInformationValues | null>(null);
  const [errors, setErrors] = useState<BikeInformationErrors>({});

  const startEditing = () => {
    if (!bike) return;
    setValues(toValues(bike));
    setErrors({});
    setIsEditing(true);
  };

  const cancel = () => {
    setValues(null);
    setErrors({});
    setIsEditing(false);
  };

  const save = () => {
    if (!values) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    updateBike({
      brand: values.brand.trim(),
      model: values.model.trim(),
      category: values.category.trim(),
      priceCents: Math.round(Number(values.price) * 100),
      description: values.description.trim(),
    })
      .then(cancel)
      // On failure, stay in edit mode so the changes are not lost
      .catch(() => {})
      .finally(() => setIsSaving(false));
  };

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

  const textField = (
    name: keyof BikeInformationValues,
    label: string,
    type: string = "text",
  ) =>
    values && (
      <>
        <label htmlFor={`information-${name}`}>{label}</label>
        <Input
          id={`information-${name}`}
          type={type}
          value={values[name]}
          status={errors[name] && "error"}
          onChange={(event) => {
            setValues({ ...values, [name]: event.target.value });
            setErrors({ ...errors, [name]: undefined });
          }}
        />
        {errors[name] && (
          <Typography.Text type="danger">{errors[name]}</Typography.Text>
        )}
      </>
    );

  return (
    <Card
      title="Bike information"
      style={{ height: "100%" }}
      extra={
        isEditing ? (
          <Space>
            <Button icon={<CloseOutlined />} onClick={cancel}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={isSaving}
              onClick={save}
            >
              Save
            </Button>
          </Space>
        ) : (
          <Button
            icon={<EditOutlined />}
            aria-label="Edit bike information"
            disabled={!bike}
            onClick={startEditing}
          />
        )
      }
    >
      {isEditing && values ? (
        <Row gutter={[16, 16]}>
          <Col span={12}>{textField("brand", "Brand *")}</Col>
          <Col span={12}>{textField("model", "Model *")}</Col>
          <Col span={12}>{textField("category", "Category *")}</Col>
          <Col span={12}>{textField("price", "Price (€) *", "number")}</Col>
          <Col span={24}>{textField("description", "Description *")}</Col>
        </Row>
      ) : (
        <Descriptions column={1} items={items} />
      )}
    </Card>
  );
};
