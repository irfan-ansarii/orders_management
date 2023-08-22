import React, { useState } from "react";
import {
  Button,
  Typography,
  Badge,
  Drawer,
  List,
  Tooltip,
  App,
  Tag,
} from "antd";
import { MdPerson, MdWest, MdOutlineCheckCircle } from "react-icons/md";
import { RiTodoFill } from "react-icons/ri";
import SimpleBar from "simplebar-react";
import NewTask from "./NewTaskDrawer";
const { Title } = Typography;
import {
  useTaskData,
  useUpdateTask,
} from "../../../../../hooks/data/useTaskData";
import { useSession } from "../../../../../context/useSession";
import moment from "moment";

const Notifications = () => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSession();
  const { message } = App.useApp();
  const { data, mutate } = useTaskData(user?.id);

  const { trigger, isMutating } = useUpdateTask();

  const updateTask = (id) => {
    message.loading({ content: "Please wait...", key: "loading" });
    trigger(
      { data: { id, status: "completed" } },
      {
        onSuccess: () => {
          message.destroy("loading");
          message.success("Task has been successfully completed.");
          mutate();
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
  const getTaskCount = () => {
    const pendingCount = (data?.data?.data || []).reduce((count, task) => {
      if (task.attributes.status !== "completed") {
        return count + 1;
      }
      return count;
    }, 0);
    return pendingCount;
  };
  return (
    <>
      <Badge
        count={getTaskCount()}
        offset={[-6, 6]}
        style={{ pointerEvents: "none" }}
      >
        <Button
          type="text"
          size="large"
          icon={<RiTodoFill />}
          onClick={() => setOpen(true)}
        ></Button>
      </Badge>
      <Drawer
        title={
          <div className="d-flex align-center justify-space-between">
            <span>My Tasks</span>
            <NewTask open={isOpen} setOpen={setIsOpen} mutate={mutate} />
          </div>
        }
        rootClassName="notification-drawer"
        destroyOnClose={true}
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        closeIcon={<MdWest className="text-lg" />}
        footer={
          <Button type="primary" block size="large">
            View All
          </Button>
        }
      >
        <SimpleBar className="simplebar h-100 px-6">
          <List
            itemLayout="horizontal"
            dataSource={data?.data?.data || []}
            renderItem={(item, index) => (
              <List.Item
                extra={
                  <Tooltip
                    title={
                      item.attributes.status == "completed"
                        ? "Completed"
                        : "Mark as complete"
                    }
                  >
                    <Button
                      loading={isMutating}
                      onClick={() => updateTask(item.id)}
                      className="d-flex align-center justify-center"
                      type="text"
                      icon={<MdOutlineCheckCircle className="text-lg" />}
                      disabled={
                        item.attributes.status == "completed" ? true : false
                      }
                    />
                  </Tooltip>
                }
              >
                <List.Item.Meta
                  title={
                    <Title
                      type={
                        item.attributes.status == "completed" && "secondary"
                      }
                      level={5}
                      className="text-sm"
                      delete={
                        item.attributes.status == "completed" ? true : false
                      }
                    >
                      {item.attributes.name}
                    </Title>
                  }
                  description={
                    <div>
                      <div>{item.attributes.description}</div>

                      {item.attributes.assignedTo?.data && (
                        <div className="mt-1 text-right">
                          <Tag
                            className="border-none uppercase px-2"
                            style={{ marginRight: "-32px" }}
                            color={
                              item.attributes?.priority == "high"
                                ? "volcano-inverse"
                                : item.attributes?.priority == "medium"
                                ? "blue-inverse"
                                : "cyan-inverse"
                            }
                          >
                            {item.attributes?.priority}
                          </Tag>
                        </div>
                      )}
                      <div
                        className="d-flex justify-space-between mt-1 text-xs"
                        style={{ marginRight: "-32px" }}
                      >
                        <div>
                          {item.attributes.assignedTo?.data &&
                            (user.id ===
                            item.attributes.assignedTo?.data?.id ? (
                              <Tooltip title="Assigned by">
                                <div className="d-inline-flex align-center">
                                  <MdPerson className="mr-1" />
                                  {item.attributes.user?.data?.attributes?.name}
                                </div>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Assigned to">
                                <div className="d-inline-flex align-center">
                                  <MdPerson className="mr-1" />
                                  {
                                    item.attributes.assignedTo?.data?.attributes
                                      ?.name
                                  }
                                </div>
                              </Tooltip>
                            ))}
                          {!item.attributes.assignedTo?.data && (
                            <Tag
                              className="border-none uppercase px-2"
                              color={
                                item.attributes?.priority == "high"
                                  ? "volcano-inverse"
                                  : item.attributes?.priority == "medium"
                                  ? "blue-inverse"
                                  : "cyan-inverse"
                              }
                            >
                              {item.attributes?.priority}
                            </Tag>
                          )}
                        </div>
                        <div>
                          {moment(item.attributes.createdAt).format(
                            "DD MMM, YYYY"
                          )}
                        </div>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </SimpleBar>
      </Drawer>
    </>
  );
};

export default Notifications;
