import { DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
import { isAxiosError } from "axios";
import { useState } from "react";
import type { BikeModel } from "../models/BikeModel";

interface DeleteBikeButtonProps {
  bike: BikeModel;
  deleteBike: (id: string) => Promise<void>;
}
export const DeleteBikeButton = ({
  bike,
  deleteBike,
}: DeleteBikeButtonProps) => {
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
    deleteBike(bike.id)
      .then(onCancel)
      // On failure, stay in the modal so the error can be read
      .catch((error) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          setError(error.response.data.message);
        } else {
          setError("This bike could not be deleted");
        }
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <>
      <Button danger onClick={() => setIsOpen(true)}>
        <DeleteOutlined />
      </Button>
      <Modal
        centered
        okButtonProps={{ danger: true }}
        open={isOpen}
        title={`Deleting ${bike.brand} ${bike.model}`}
        onCancel={onCancel}
        onOk={onConfirm}
        okText="Yes, delete"
        confirmLoading={isDeleting}
      >
        You are about to delete the bike {bike.brand} {bike.model}. This action
        cannot be undone, are you sure ?
        {error && (
          <div>
            <Typography.Text type="danger">{error}</Typography.Text>
          </div>
        )}
      </Modal>
    </>
  );
};
