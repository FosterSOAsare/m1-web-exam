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
  Switch,
  Typography,
} from "antd";
import type { ReactNode } from "react";
import { useState } from "react";
import type { BikeModel, UpdateBikeModel } from "../models/BikeModel";

interface BikeSpecificationsCardProps {
  bike: BikeModel | null;
  isLoading: boolean;
  updateBike: (input: UpdateBikeModel) => Promise<void>;
}

type TextField =
  | "frameMaterial"
  | "frameSizeCm"
  | "wheelSizeInches"
  | "gearCount"
  | "weightKg";

type BikeSpecificationsValues = Record<TextField, string> & {
  electric: boolean;
};

type BikeSpecificationsErrors = Partial<Record<TextField, string>>;

const toValues = (bike: BikeModel): BikeSpecificationsValues => ({
  frameMaterial: bike.frameMaterial,
  frameSizeCm: String(bike.frameSizeCm),
  wheelSizeInches: String(bike.wheelSizeInches),
  gearCount: String(bike.gearCount),
  weightKg: String(bike.weightKg),
  electric: bike.electric,
});

const validate = (
  values: BikeSpecificationsValues,
): BikeSpecificationsErrors => {
  const errors: BikeSpecificationsErrors = {};
  if (!values.frameMaterial.trim())
    errors.frameMaterial = "Frame material is required";
  if (!values.frameSizeCm.trim()) errors.frameSizeCm = "Frame size is required";
  else if (Number(values.frameSizeCm) <= 0)
    errors.frameSizeCm = "Frame size must be greater than 0";
  if (!values.wheelSizeInches.trim())
    errors.wheelSizeInches = "Wheel size is required";
  else if (Number(values.wheelSizeInches) <= 0)
    errors.wheelSizeInches = "Wheel size must be greater than 0";
  if (!values.gearCount.trim()) errors.gearCount = "Gears are required";
  else if (
    !Number.isInteger(Number(values.gearCount)) ||
    Number(values.gearCount) <= 0
  )
    errors.gearCount = "Gears must be a whole number greater than 0";
  if (!values.weightKg.trim()) errors.weightKg = "Weight is required";
  else if (Number(values.weightKg) <= 0)
    errors.weightKg = "Weight must be greater than 0";
  return errors;
};

export const BikeSpecificationsCard = ({
  bike,
  isLoading,
  updateBike,
}: BikeSpecificationsCardProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeSpecificationsValues | null>(null);
  const [errors, setErrors] = useState<BikeSpecificationsErrors>({});

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
      frameMaterial: values.frameMaterial.trim(),
      frameSizeCm: Number(values.frameSizeCm),
      wheelSizeInches: Number(values.wheelSizeInches),
      gearCount: Number(values.gearCount),
      weightKg: Number(values.weightKg),
      electric: values.electric,
    })
      .then(cancel)
      // On failure, stay in edit mode so the changes are not lost
      .catch(() => {})
      .finally(() => setIsSaving(false));
  };

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
      label: "Electric",
      children: value(bike && (bike.electric ? "Yes" : "No")),
    },
  ];

  const textField = (
    name: TextField,
    label: string,
    type: string = "text",
  ) =>
    values && (
      <>
        <label htmlFor={`specifications-${name}`}>{label}</label>
        <Input
          id={`specifications-${name}`}
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
      title="Specifications"
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
            aria-label="Edit specifications"
            disabled={!bike}
            onClick={startEditing}
          />
        )
      }
    >
      {isEditing && values ? (
        <Row gutter={[16, 16]}>
          <Col span={24}>{textField("frameMaterial", "Frame material *")}</Col>
          <Col span={12}>
            {textField("frameSizeCm", "Frame size (cm) *", "number")}
          </Col>
          <Col span={12}>
            {textField("wheelSizeInches", "Wheel size (in) *", "number")}
          </Col>
          <Col span={12}>{textField("gearCount", "Gears *", "number")}</Col>
          <Col span={12}>{textField("weightKg", "Weight (kg) *", "number")}</Col>
          <Col span={24}>
            <Space>
              <label htmlFor="specifications-electric">Electric</label>
              <Switch
                id="specifications-electric"
                checked={values.electric}
                onChange={(checked) =>
                  setValues({ ...values, electric: checked })
                }
              />
            </Space>
          </Col>
        </Row>
      ) : (
        <Descriptions column={1} items={items} />
      )}
    </Card>
  );
};
