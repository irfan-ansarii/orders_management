import React, { useState } from "react";
import { Card, Upload, Form, App } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const MediaCard = ({ loading }) => {
  const [fileList, setFileList] = useState([]);
  const { message, modal } = App.useApp();

  const handleUpload = ({ fileList }) => {
    const tempFiles = [];
    fileList.forEach((file, i) => {
      const tempFile = { ...file, status: "done" };
      tempFiles.push(tempFile);
    });
    setFileList(tempFiles);
  };

  const handleRemove = (file) => {
    const id = file.uid;

    if (!file.originFileObj) {
      modal.confirm({
        title: "Delete",
        content:
          "Are you sure you want to delete this image? This action cannot be undone.",
        okText: "Delete",
        okButtonProps: { danger: true },
        onOk: () => {
          deleteFile.trigger(
            { id },
            {
              onSuccess: () => {
                mutate();

                message.success("Media has been deleted successfully.");
              },
              onError: () => {
                message.error("Something went wrong while deleting the media.");
              },
            }
          );
        },
      });
      return false;
    } else {
      return true;
    }
  };

  return (
    <Card title="Media" className="mb-6" bordered={false} loading={loading}>
      <Form.Item name="images" className="mb-0">
        <Upload.Dragger
          listType="picture"
          multiple
          onChange={handleUpload}
          onRemove={handleRemove}
        >
          <div className="py-4">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to upload</p>
          </div>
        </Upload.Dragger>
      </Form.Item>
    </Card>
  );
};

export default MediaCard;

MediaCard.defaultProps = {
  loading: false,
};
