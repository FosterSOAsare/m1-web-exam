import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Space,
  Switch,
  Typography,
} from "antd";
import { useState } from "react";
import type { CreateBikeModel } from "../models/BikeModel";

interface AddBikeButtonProps {
  createBike: (input: CreateBikeModel) => Promise<void>;
}

type TextField =
  | Exclude<keyof CreateBikeModel, "electric" | "priceCents">
  | "price";

type BikeFormValues = Record<TextField, string> & {
  electric: boolean;
};

type BikeFormErrors = Partial<Record<TextField, string>>;

const emptyValues: BikeFormValues = {
  brand: "",
  model: "",
  description: "",
  category: "",
  frameMaterial: "",
  frameSizeCm: "",
  wheelSizeInches: "",
  gearCount: "",
  weightKg: "",
  price: "",
  electric: false,
};

const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  if (!values.brand.trim()) errors.brand = "Brand is required";
  if (!values.model.trim()) errors.model = "Model is required";
  if (!values.description.trim())
    errors.description = "Description is required";
  if (!values.category.trim()) errors.category = "Category is required";
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
  if (!values.price.trim()) errors.price = "Price is required";
  else if (Number(values.price) < 0) errors.price = "Price cannot be negative";
  return errors;
};

const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => {
  return {
    brand: values.brand.trim(),
    model: values.model.trim(),
    description: values.description.trim(),
    category: values.category.trim(),
    frameMaterial: values.frameMaterial.trim(),
    frameSizeCm: Number(values.frameSizeCm),
    wheelSizeInches: Number(values.wheelSizeInches),
    gearCount: Number(values.gearCount),
    weightKg: Number(values.weightKg),
    electric: values.electric,
    priceCents: Math.round(Number(values.price) * 100),
  };
};

export const AddBikeButton = ({ createBike }: AddBikeButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(emptyValues);
  const [errors, setErrors] = useState<BikeFormErrors>({});

  const close = () => {
    setValues(emptyValues);
    setErrors({});
    setIsOpen(false);
  };

  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    createBike(toCreateBikeModel(values))
      .then(close)
      // On failure, stay in the modal so the values are not lost
      .catch(() => {})
      .finally(() => setIsSaving(false));
  };

  const textField = (name: TextField, label: string, type: string = "text") => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <Input
        id={`bike-${name}`}
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
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsOpen(true)}
      >
        Add bike
      </Button>
      <Modal
        open={isOpen}
        title="New bike"
        okText="Add bike"
        onCancel={close}
        onOk={onConfirm}
        confirmLoading={isSaving}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>{textField("brand", "Brand *")}</Col>
          <Col span={12}>{textField("model", "Model *")}</Col>
          <Col span={24}>{textField("description", "Description *")}</Col>
          <Col span={12}>{textField("category", "Category *")}</Col>
          <Col span={12}>{textField("frameMaterial", "Frame material *")}</Col>
          <Col span={8}>
            {textField("frameSizeCm", "Frame size (cm) *", "number")}
          </Col>
          <Col span={8}>
            {textField("wheelSizeInches", "Wheel size (in) *", "number")}
          </Col>
          <Col span={8}>{textField("gearCount", "Gears *", "number")}</Col>
          <Col span={12}>{textField("weightKg", "Weight (kg) *", "number")}</Col>
          <Col span={12}>{textField("price", "Price (€) *", "number")}</Col>
          <Col span={24}>
            <Space>
              <label htmlFor="bike-electric">Electric</label>
              <Switch
                id="bike-electric"
                checked={values.electric}
                onChange={(checked) =>
                  setValues({ ...values, electric: checked })
                }
              />
            </Space>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
