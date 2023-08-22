import React, { useState, useEffect, useMemo } from "react";
import { Steps } from "antd";
import moment from "moment";

import {
  isCancelled,
  isRejected,
  determineStatusTypes,
  mapToUpdatedTimeline,
} from "../../../utils/order";

const StatusCard = ({ data }) => {
  const [timeline, setTimeline] = useState([]);

  const updateTimelines = () => {
    if (!data) return [];

    const { type, tracking, cancelledAt, createdAt, orderDate, currentStatus } =
      data.attributes;

    // return cancllled
    const cancelledTimeline = isCancelled(cancelledAt, type, createdAt);

    if (cancelledTimeline) {
      return cancelledTimeline;
    }

    // return rejected
    const returnTimeline = isRejected(currentStatus, createdAt);

    if (returnTimeline) {
      return returnTimeline;
    }

    const statusTypes = determineStatusTypes(type, currentStatus);

    const updatedTimeline = mapToUpdatedTimeline(statusTypes, tracking);

    const textArray = updatedTimeline.map((obj) => obj.status);

    const lastIndex = textArray.lastIndexOf("finish");

    updatedTimeline.slice(0, lastIndex).forEach((step) => {
      step.status = "finish";
    });

    // mark 1st step as finished
    updatedTimeline[0].description = moment(orderDate || createdAt).format(
      "DD MMM, YYYY"
    );

    return updatedTimeline;
  };

  useEffect(() => {
    const updatedStatus = updateTimelines();
    setTimeline(updatedStatus);
  }, [data]);

  const memoizedTimeline = useMemo(() => timeline, [timeline]);

  return <Steps labelPlacement="vertical" items={memoizedTimeline} />;
};

export default StatusCard;
