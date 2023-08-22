import { useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row, Button, App } from "antd";
import { MdAdd } from "react-icons/md";
import { useUsersData } from "../../hooks/data/useUserData";
import EmptyPage from "../../components/global/empty/EmptyPage";
import Filter from "../../components/views/users/all/Filter";
import UserCard from "../../components/views/users/all/UserCard";

const Users = () => {
  const router = useRouter();

  const { message } = App.useApp();
  const { isLoading, data, error } = useUsersData(router.query);

  useEffect(() => {
    if (error && router.isReady && !isLoading)
      message.open({
        type: "error",
        content:
          error?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again",
      });
  }, [error]);

  const isEmpty = data?.data?.length < 1 && !isLoading;

  return (
    <>
      <Filter />

      {/* fixed buttonn */}
      <Button
        className="btn-float"
        icon={<MdAdd />}
        onClick={() => router.push("/users?modal=new")}
      >
        Add
      </Button>
      {/*  data card */}
      {!isEmpty && (
        <Row className="md-gutter-4">
          {/* Data */}
          {data?.data?.map((data) => (
            <Col span={24} md={{ span: 12 }} key={data?.id}>
              <UserCard showAction data={data} />
            </Col>
          ))}
        </Row>
      )}

      {(isLoading || !router.isReady) && (
        <Row className="md-gutter-4">
          {Array(10)
            .fill()
            .map((val, key) => (
              <Col span={24} md={{ span: 12 }} key={key}>
                <UserCard loading />
              </Col>
            ))}
        </Row>
      )}

      {/* Error or empty */}
      {(error || isEmpty) && <EmptyPage description={error} />}
    </>
  );
};
export default Users;
