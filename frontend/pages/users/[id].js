import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Button, App } from "antd";
import { useEditUser, useUserData } from "../../hooks/data/useUserData";
import { useAppSettting } from "../../context/useAppSettting";
import TimelineCard from "../../components/views/timeline/TimelineCard";
import SinglePageContent from "../../components/global/single-page-content/SinglePageContent";
import UserCard from "../../components/views/users/single/UserCard";
import EmptyPage from "../../components/global/empty/EmptyPage";
import { MdAdd } from "react-icons/md";
import UserTimelineCard from "../../components/views/timeline/UserTimelineCard";
const UserDetails = () => {
  const { setPageTitle, pageTitle } = useAppSettting();
  const router = useRouter();
  const { isLoading, data, mutate, error } = useUserData(router.query.id);
  const edit = useEditUser();
  const { message } = App.useApp();

  const onChange = (value) => {
    value.id = data?.data?.id;
    edit.trigger(value, {
      onSuccess: () => {
        mutate();
      },
    });
  };
  useEffect(() => {
    if (error && router.isReady && !isLoading)
      message.open({
        type: "error",
        content:
          error?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again",
      });
  }, [error]);

  useEffect(() => {
    setPageTitle(data?.data?.name);
  }, [data]);

  return (
    <SinglePageContent
      title={pageTitle}
      action={
        data?.data?.blocked === true ? (
          <Button
            type="text"
            className="text-button"
            onClick={() => onChange({ blocked: false })}
            loading={edit.isMutating}
          >
            {edit.isMutating ? "Enabling..." : "Enable"}
          </Button>
        ) : (
          <Button
            danger
            type="text"
            className="text-button"
            onClick={() => onChange({ blocked: true })}
            loading={edit.isMutating}
          >
            {edit.isMutating ? "Disabling..." : "Disable"}
          </Button>
        )
      }
    >
      {/* fixed button */}
      {data?.data?.blocked === true ? (
        <Button
          className="btn-float"
          onClick={() => onChange({ blocked: false })}
          loading={edit.isMutating}
        >
          {edit.isMutating ? "Enabling..." : "Enable"}
        </Button>
      ) : (
        <Button
          className="btn-float"
          onClick={() => onChange({ blocked: true })}
          loading={edit.isMutating}
        >
          {edit.isMutating ? "Disabling..." : "Disable"}
        </Button>
      )}

      {/* content */}
      {data?.status === 200 && (
        <Row className="lg-gutter-4">
          <Col span={24} lg={{ span: 16, offset: 4 }} className="mb-6">
            <UserCard
              data={data?.data}
              loading={isLoading || !router.isReady}
            />
            <TimelineCard filters={{ user: data?.data?.id }} />
          </Col>
        </Row>
      )}
      {data?.status !== 200 && <EmptyPage />}
    </SinglePageContent>
  );
};

export default UserDetails;
