import React, { useState } from "react";
import { Timeline, Card, Typography, Button, Tag } from "antd";
import { MdPerson } from "react-icons/md";
import { useTimelineData } from "../../../hooks/data/useTimelineData";
import moment from "moment";

const TimelineCard = ({ filters, loading }) => {
  const [pageSize, setPageSize] = useState();
  const { data, isLoading } = useTimelineData({ ...filters, pageSize });

  const timelines = data?.data?.data?.map((timeline) => {
    return {
      color: timeline?.attributes?.color,
      children: (
        <div>
          <Typography.Text strong className="d-block">
            {timeline?.attributes?.name}
          </Typography.Text>

          <Typography.Text className="d-block text-xs mb-2" type="secondary">
            {moment(timeline?.attributes?.createdAt).format(
              "DD-MM-YYYY | hh:mm:ss A"
            )}
          </Typography.Text>
          {timeline?.attributes?.description && (
            <Typography.Text className="d-block mt-2" type="secondary">
              {timeline?.attributes?.description}
            </Typography.Text>
          )}
          {timeline?.attributes?.quantity !== null && (
            <Tag
              className="px-4 border-none"
              color={timeline?.attributes?.quantity > 0 ? "success" : "error"}
            >
              {timeline?.attributes?.quantity > 0
                ? `+${timeline?.attributes?.quantity}`
                : timeline?.attributes?.quantity}
            </Tag>
          )}

          {timeline?.attributes?.user?.data && (
            <Typography.Text className="d-block" type="secondary">
              <MdPerson className="anticon text-md mr-1" />
              {timeline?.attributes?.user?.data?.attributes?.name}
            </Typography.Text>
          )}
        </div>
      ),
    };
  });

  return (
    <Card
      bordered={false}
      title="Timeline"
      className="mb-6"
      loading={isLoading || loading}
    >
      <Timeline items={timelines} />

      {/* load more button */}
      {data?.data?.meta?.pagination?.pageSize <
        data?.data?.meta?.pagination?.total && (
        <div className="text-center mt-4">
          <Button
            type="text"
            className="text-button"
            loading={isLoading}
            onClick={() => setPageSize(data?.data?.meta?.pagination?.total)}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TimelineCard;
