import React, { useState, useEffect } from "react";
import { Typography, Tag } from "antd";
import { getStatusTag } from "../../../../utils/order";
import moment from "moment/moment";

const StatusTag = ({ data }) => {
  const [status, setStatus] = useState({});

  useEffect(() => {
    if (data) {
      const tag = getStatusTag(data);
      setStatus(tag);
    }
  }, [data]);

  return (
    <>
      <Typography.Text type="secondary" className="d-block uppercase text-xs">
        {moment(status?.date).format("DD MMM, YYYY")}
      </Typography.Text>
      <Tag
        color={status?.color}
        className="mr-0 uppercase d-inline-flex align-center border-none gap-1 px-2"
      >
        {status?.name}
      </Tag>
    </>
  );
};

export default StatusTag;
