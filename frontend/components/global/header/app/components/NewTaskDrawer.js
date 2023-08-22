import React, { useState, useEffect } from "react";
import { Button, Drawer, Form, Input, Select, App } from "antd";
import { MdWest } from "react-icons/md";
import SimpleBar from "simplebar-react";
import { useUsersData } from "../../../../../hooks/data/useUserData";
import { useCreateTask } from "../../../../../hooks/data/useTaskData";
import { useSession } from "../../../../../context/useSession";

const NewTask = ({ open, setOpen, mutate }) => {
  const { data } = useUsersData({});
  const { message } = App.useApp();
  const { user } = useSession();
  const [form] = Form.useForm();
  const { trigger, isMutating } = useCreateTask();
  const [usersOption, setUsersOption] = useState([]);

  const onSubmit = (values) => {
    values.user = user.id;
    message.loading({ content: "Please wait...", key: "loading" });
    trigger(
      { data: values },
      {
        onSuccess: () => {
          message.destroy("loading");
          message.success("New task has been successfully created.");
          form.resetFields();
          mutate();
          setOpen(false);
        },

        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again";
          message.error(content);
        },
      }
    );
  };

  useEffect(() => {
    const tempOptions = data?.data
      ?.filter((current) => current.id !== user.id)
      .map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });

    setUsersOption(tempOptions);
  }, [data]);
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        New
      </Button>
      <Drawer
        title="New Task"
        rootClassName="notification-drawer"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        closeIcon={<MdWest className="text-lg" />}
        footer={
          <Button
            type="primary"
            loading={isMutating}
            block
            size="large"
            onClick={() => form.submit()}
          >
            Save
          </Button>
        }
      >
        <SimpleBar className="simplebar h-100  px-6">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            preserve={false}
            onFinish={onSubmit}
          >
            <Form.Item
              name="name"
              label="Title"
              className="pt-4"
              rules={[{ required: true, message: "Title is required." }]}
            >
              <Input size="large" placeholder="New Task" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              className="pt-4"
              rules={[{ required: true, message: "Description is required." }]}
            >
              <Input.TextArea
                size="large"
                placeholder="Type here..."
                rows={3}
              />
            </Form.Item>
            <Form.Item
              name="priority"
              label="Priority"
              className="pt-4"
              rules={[{ required: true, message: "Priority is required." }]}
            >
              <Select
                size="large"
                placeholder="Medium"
                options={[
                  {
                    label: "Low",
                    value: "low",
                  },
                  {
                    label: "Medium",
                    value: "medium",
                  },
                  {
                    label: "High",
                    value: "high",
                  },
                ]}
              ></Select>
            </Form.Item>
            <Form.Item name="assignedTo" label="Assign To" className="pt-4">
              <Select
                size="large"
                placeholder="User"
                options={usersOption}
              ></Select>
            </Form.Item>
          </Form>
        </SimpleBar>
      </Drawer>
    </>
  );
};

export default NewTask;
