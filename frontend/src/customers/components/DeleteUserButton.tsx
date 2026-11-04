import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
import { useState } from "react";
import type { CustomerModel } from "../models/CustomerModel";

interface DeleteCustomerButtonProps {
  customer: CustomerModel;
  deleteCustomer: (id: string) => Promise<void>;
}
export const DeleteCustomerButton = ({
  customer,
  deleteCustomer,
}: DeleteCustomerButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onCancel = () => {
    setError(null);
    setIsOpen(false);
  };

  const onConfirm = () => {
    setError(null);
    setIsDeleting(true);
    deleteCustomer(customer.id)
      .then(onCancel)
      // On failure, stay in the modal so the error can be read
      .catch(() => setError("This customer could not be deleted"))
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <Button danger onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
      </Button>
      <Modal
        okButtonProps={{ danger: true }}
        open={isOpen}
        title={`Deleting ${customer.firstName}`}
        onCancel={onCancel}
        onOk={onConfirm}
        okText="Yes, delete"
        confirmLoading={isDeleting}
      >
        You are about to delete the customer {customer.lastName}{" "}
        {customer.firstName}. This action cannot be undone, are you sure ?
        {error && (
          <div>
            <Typography.Text type="danger">{error}</Typography.Text>
          </div>
        )}
      </Modal>
    </>
  );
};
