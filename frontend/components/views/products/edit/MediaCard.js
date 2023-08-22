import React, { useState, useEffect } from "react";
import { Card, Upload, Form, App } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useUploadMedia } from "../../../../hooks/data/useUserData";
import { useDeleteFile } from "../../../../hooks/data/useSettingData";
import { getMediaURL } from "../../../../utils";
import capitalize from "capitalize";

const MediaCard = ({ loading, images, refId, mutate }) => {
  const { message, modal } = App.useApp();
  const { trigger } = useUploadMedia();
  const deleteFile = useDeleteFile();
  const [fileList, setFileList] = useState([]);

  const upload = ({ file }) => {
    const form = new FormData();
    const imageData = {
      ref: "api::product.product",
      refId,
      field: "images",
      files: file,
    };

    Object.keys(imageData).map((key) => form.append(key, imageData[key]));

    trigger(form, {
      onSuccess: (res) => {
        mutate();
      },
      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";

        message.error(capitalize(content));
      },
    });
  };
  const handleUpload = ({ file, fileList }) => {
    setFileList([...fileList]);
  };

  const handleRemove = (file) => {
    const id = file.uid;

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
              message.success("Image has been deleted successfully.");
            },
            onError: () => {
              message.error("Something went wrong while deleting the media.");
            },
          }
        );
      },
    });
    return false;
  };

  useEffect(() => {
    setFileList(
      images?.data?.map((img) => ({
        uid: img?.id,
        name: img?.attributes?.name,
        status: "done",
        percent: 80,
        url: getMediaURL(img?.attributes?.url),
      }))
    );
  }, [images]);

  return (
    <Card title="Media" className="mb-6" bordered={false} loading={loading}>
      <Form.Item className="mb-0">
        <Upload.Dragger
          listType="picture"
          multiple
          onChange={handleUpload}
          customRequest={upload}
          onRemove={handleRemove}
          fileList={fileList}
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
  images: [],
};
