import React, { useState, useEffect } from "react";
import { Card, Input, Form, Button, Upload, App } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useEditUser, useUploadMedia } from "../../../hooks/data/useUserData";
import { useDeleteFile } from "../../../hooks/data/useSettingData";

import { getMediaURL } from "../../../utils";
import capitalize from "capitalize";

const EditProfile = ({ data }) => {
  const [fileList, setFileList] = useState([]);
  const { message } = App.useApp();

  // user data
  const { trigger, isMutating } = useEditUser();

  // upload image
  const avatar = useUploadMedia();

  // delete image
  const deleteFile = useDeleteFile();

  const onSubmit = (values) => {
    values.id = data?.id;
    trigger(values, {
      onSuccess: (res) => {
        message.success("Your profile has been successfully updated.");
      },
      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";

        message.error({
          content: capitalize(content),
        });
      },
    });
  };

  const handleChange = ({ fileList: newFileList }) => {
    const imageData = {
      ref: "plugin::users-permissions.user",
      refId: data?.id,
      field: "image",
      files: newFileList?.[0].originFileObj,
    };

    // delete old file
    if (fileList.length > 0) {
      const fileId = fileList?.[0]?.uid;
      if (!fileList?.[0]?.originFileObj) {
        deleteFile.trigger({ id: fileId });
      }
    }

    const formData = new FormData();
    Object.keys(imageData).map((key) => formData.append(key, imageData[key]));

    // create new
    avatar.trigger(formData, {
      onSuccess: (res) => {
        message.success("Your profile picture has been successfully updated.");
      },
      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";

        message.error({
          content: capitalize(content),
        });
      },
    });
  };

  useEffect(() => {
    if (data && data.image) {
      setFileList([
        {
          uid: data.image.id,
          name: data.image.name,
          status: "done",
          url: getMediaURL(data.image.url),
        },
      ]);
    }
  }, [data]);
  return (
    <Card bordered={false} title="Edit Profile" className="mb-6">
      <Form.Item className="mb-6">
        <Upload.Dragger
          maxCount={1}
          onChange={(e) => handleChange(e)}
          showUploadList={{ showRemoveIcon: false }}
          fileList={fileList}
          listType="picture"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to upload</p>
        </Upload.Dragger>
      </Form.Item>
      <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
        <Form.Item
          label="Full Name"
          name="name"
          rules={[{ required: true, min: 5 }]}
          hasFeedback
          initialValue={data?.name}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Mobile"
          name="mobile"
          rules={[
            {
              required: true,
              len: 10,
              pattern: "[0-9]{10}",
              message: "Please enter Mobile",
            },
          ]}
          hasFeedback
          initialValue={data?.mobile}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
          hasFeedback
          initialValue={data?.email}
        >
          <Input size="large" />
        </Form.Item>
        <Button
          htmlType="submit"
          size="large"
          type="primary"
          block
          loading={isMutating}
        >
          Save
        </Button>
      </Form>
    </Card>
  );
};

export default EditProfile;
