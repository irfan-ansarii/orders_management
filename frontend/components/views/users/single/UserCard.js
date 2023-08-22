import React from "react";
import { Card, Col, Row, Typography, Avatar, Tag, Space } from "antd";
import { MdOutlineBlock, MdOutlineDoneAll, MdVerified } from "react-icons/md";
import { getAvatarName } from "../../../../utils";
import { getMediaURL } from "../../../../utils";

const UserCard = ({ data, loading }) => {
  return (
    <Card
      bordered={false}
      className="mb-6 overflow-hidden pa-2"
      loading={loading}
      size="small"
    >
      <Col span={24} className="d-flex gap-6 mb-6">
        <Avatar
          size={100}
          shape="square"
          src={getMediaURL(data?.image?.url)}
          className="flex-shrink-0"
        >
          {getAvatarName(data?.name)}
        </Avatar>
        <div className="flex-grow-1">
          <div className="d-flex justify-space-between">
            <div>
              <Typography.Text ellipsis className="d-block">
                {data?.name}
              </Typography.Text>
              <Typography.Text type="secondary d-block mb-1">
                {data?.username}
              </Typography.Text>
              <Typography.Text className="d-block" copyable>
                {data?.mobile}
              </Typography.Text>
              <Typography.Text className="d-block" copyable>
                {data?.email}
              </Typography.Text>
            </div>
            <div>
              {data?.confirmed ? (
                <Tag
                  color="success"
                  className="border-none px-3 mr-0 py-1 uppercase d-flex align-center"
                >
                  <MdVerified className="mr-2 text-sm" />
                  Verified
                </Tag>
              ) : (
                <Tag
                  color="volcano"
                  className="border-none px-3 mr-0 py-1 uppercase d-flex align-center"
                >
                  not Verified
                </Tag>
              )}
            </div>
          </div>
        </div>
      </Col>
      <Tag className="py-2 border-none d-block ma-0">
        <Row gutter={12} justify="space-between">
          <Col>
            <Typography.Text
              type="secondary"
              className="uppercase d-block text-xs"
            >
              role
            </Typography.Text>
            {data?.userRole === "admin" ? (
              <Tag className="mr-0 px-2 border-none uppercase" color="magenta">
                {data?.userRole}
              </Tag>
            ) : (
              <Tag className="mr-0 px-2 border-none uppercase" color="gold">
                {data?.userRole}
              </Tag>
            )}
          </Col>
          <Col>
            <Typography.Text
              type="secondary"
              className="uppercase d-block text-xs"
            >
              status
            </Typography.Text>
            {data?.blocked ? (
              <Tag className="mr-0 px-2 border-none uppercase" color="error">
                <MdOutlineBlock className="anticon mr-1" />
                inactive
              </Tag>
            ) : (
              <Tag className="mr-0 px-2 border-none uppercase" color="success">
                <MdOutlineDoneAll className="anticon mr-1" />
                active
              </Tag>
            )}
          </Col>
        </Row>
      </Tag>
    </Card>
  );
};

export default UserCard;
