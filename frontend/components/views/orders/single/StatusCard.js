import React, { useState, useEffect, useMemo } from "react";
import { Card, Steps } from "antd";
import moment from "moment";

import {
  isCancelled,
  isRejected,
  determineStatusTypes,
  mapToUpdatedTimeline,
} from "../../../../utils/order/";
const StatusCard = ({ data, loading }) => {
  const [timeline, setTimeline] = useState([]);

  const updateTimelines = () => {
    if (loading || !data) return [];

    const {
      type,
      tracking,
      cancelledAt,
      createdAt,
      remittance,
      currentStatus,
    } = data.attributes;

    const orderCancelledTimeline = isCancelled(cancelledAt, type, createdAt);

    if (orderCancelledTimeline !== null) {
      return orderCancelledTimeline;
    }

    const orderReturnedTimeline = isRejected(currentStatus, createdAt);

    if (orderReturnedTimeline !== null) {
      return orderReturnedTimeline;
    }

    const statusTypes = determineStatusTypes(type, tracking, "admin");
    const updatedTimeline = mapToUpdatedTimeline(statusTypes, tracking);

    // convert updated timeline to text array
    const textArray = updatedTimeline.map((obj) => obj.status);
    // get tha last index of finish
    const lastIndex = textArray.lastIndexOf("finish");

    updatedTimeline.slice(0, lastIndex).forEach((step) => {
      step.status = "finish";
    });

    // add remmitance date
    if (remittance !== null) {
      updatedTimeline[updatedTimeline.length - 1].description = moment(
        remittance.date
      ).format("DD MMM, YYYY");
    }

    // mark 1st step as finished
    updatedTimeline[0].description = moment(
      data.attributes.orderDate || createdAt
    ).format("DD MMM, YYYY");

    return updatedTimeline;
  };

  useEffect(() => {
    const updatedStatus = updateTimelines();
    setTimeline(updatedStatus);
  }, [data, loading]);

  const memoizedTimeline = useMemo(() => timeline, [timeline]);

  return (
    <Card
      bordered={false}
      className="mb-6"
      loading={memoizedTimeline.length > 0 ? false : true}
    >
      <Steps labelPlacement="vertical" items={memoizedTimeline} />
    </Card>
  );
};

export default StatusCard;
StatusCard.defaultProps = {
  data: {},
  loading: false,
};
