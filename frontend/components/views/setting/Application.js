import React, { useState, useEffect } from "react";
import { Card, Form, Input, Row, Col, Upload, Button, App } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { getMediaURL } from "../../../utils";
import {
  useDeleteFile,
  usePublicData,
  useEditPublic,
} from "../../../hooks/data/useSettingData";
import capitalize from "capitalize";

const Application = () => {
  const [form] = Form.useForm();
  const { message, modal } = App.useApp();
  const deleteFile = useDeleteFile();
  const edit = useEditPublic();
  const { data, isLoading, mutate } = usePublicData();

  const [image, setImage] = useState({});

  const onSubmit = async (values) => {
    const formData = new FormData();

    Object.keys(image).forEach((key) => {
      const files = image[key];
      files.forEach((file) => {
        if (file.originFileObj)
          formData.append(`files.${key}`, file.originFileObj);
      });
    });

    const { company, footerLeft, footerRight } = values;

    formData.append(
      "data",
      JSON.stringify({ company, footerLeft, footerRight })
    );

    edit.trigger(formData, {
      onSuccess: () => {
        mutate();
        message.success("Settings has been successfully saved.");
      },
      onError: () => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";
        message.error(capitalize(content));
      },
    });
  };

  const handleChange = ({ fileList }, name) => {
    fileList.forEach((file) => {
      image[name] = [{ ...file, status: "done" }];
      setImage({ ...image });
    });

    if (!fileList || fileList.length == 0) {
      image[name] = fileList;
      setImage({ ...image });
    }
  };

  const handleRemove = (file, name) => {
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
                image[name] = [];
                setImage({ ...image });
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

  useEffect(() => {
    const { logo, logoDark, trackingBg, authBg } = data?.data?.data?.attributes;

    if (logo?.data) {
      image.logo = [
        {
          uid: logo?.data?.id,
          name: logo?.data?.attributes?.name,
          status: "done",
          url: getMediaURL(logo?.data?.attributes?.url),
        },
      ];
    }
    if (logoDark?.data) {
      image.logoDark = [
        {
          uid: logoDark?.data?.id,
          name: logoDark?.data?.attributes?.name,
          status: "done",
          url: getMediaURL(logoDark?.data?.attributes?.url),
        },
      ];
    }
    if (authBg?.data) {
      image.authBg = [
        {
          uid: authBg?.data?.id,
          name: authBg?.data?.attributes?.name,
          status: "done",
          url: getMediaURL(authBg?.data?.attributes?.url),
        },
      ];
    }
    if (trackingBg?.data) {
      image.trackingBg = [
        {
          uid: trackingBg?.data?.id,
          name: trackingBg?.data?.attributes?.name,
          status: "done",
          url: getMediaURL(trackingBg?.data?.attributes?.url),
        },
      ];
    }
    setImage({ ...image });
  }, [data]);

  const FormItem = ({ label, name }) => {
    return (
      <Form.Item name={name} label={label} shouldUpdate>
        <Upload.Dragger
          maxCount={1}
          onChange={(e) => handleChange(e, name)}
          onRemove={(file) => handleRemove(file, name)}
          fileList={image[name]}
          listType="picture"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to upload</p>
        </Upload.Dragger>
      </Form.Item>
    );
  };
  return (
    <Card bordered={false}>
      <Form layout="vertical" preserve={false} form={form} onFinish={onSubmit}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Company"
              name="company"
              initialValue={data?.data?.data?.attributes?.company}
            >
              <Input size="large" />
            </Form.Item>
            <FormItem label="Logo" name="logo" />
            <FormItem label="Dark Logo" name="logoDark" />
            <FormItem label="Tracking Background" name="trackingBg" />
            <FormItem label="Auth Background" name="authBg" />
          </Col>

          <Col span={24} xl={{ span: 12 }}>
            <Form.Item
              label="Return Period"
              tooltip="In days eg: 10, default is 7"
              name="returnPeriod"
              initialValue={data?.data?.data?.attributes?.returnPeriod}
            >
              <Input size="large" />
            </Form.Item>
          </Col>

          <Col span={24} xl={{ span: 12 }}>
            <Form.Item
              label="Footer Left"
              name="footerLeft"
              initialValue={data?.data?.data?.attributes?.footerLeft}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Col span={24} xl={{ span: 12 }}>
            <Form.Item
              label="Footer Right"
              name="footerRight"
              initialValue={data?.data?.data?.attributes?.footerRight}
            >
              <Input size="large" />
            </Form.Item>
          </Col>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={edit.isMutating}
          >
            Save
          </Button>
        </Row>
      </Form>
    </Card>
  );
};

export default Application;
