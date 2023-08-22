import React from "react";
import { Empty } from "antd";

const EmptyPage = ({ description }) => {
  return (
    <Empty
      className="d-flex flex-column align-center justify-center flex-fill"
      description={
        description
          ? description?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again"
          : "No Data"
      }
    ></Empty>
  );
};

export default EmptyPage;
