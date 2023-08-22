import React from "react";
import { useRouter } from "next/router";
import { Card, Row, Typography, Tag, Skeleton, Image } from "antd";

import { MdCheck, MdOutlineBlock } from "react-icons/md";

import { getMediaURL } from "../../../../utils";

const UserCard = ({ data, loading }) => {
  const router = useRouter();
  const onClick = () => {
    router.push(`/users/${data?.id}`);
  };
  return (
    <Card
      bordered={false}
      className="mb-6 overflow-hidden pa-2 pointer"
      loading={loading}
      size="small"
      onClick={onClick}
    >
      {/*  */}
      <Row className="gap-4" wrap={false}>
        <div className="flex-shrink-0">
          {data?.image?.url ? (
            <Image
              width={140}
              height={140}
              className="rounded object-cover"
              src={getMediaURL(data?.image?.url)}
              placeholder={
                <Skeleton.Image
                  className="w-100 h-100"
                  style={{ height: "140px" }}
                ></Skeleton.Image>
              }
              preview={false}
            />
          ) : (
            <Skeleton.Image
              style={{ height: "140px", width: "140px" }}
            ></Skeleton.Image>
          )}
        </div>

        <Row className="flex-column justify-space-between flex-grow-1">
          <div className="w-100">
            <Typography.Text ellipsis className="d-block">
              {data?.name}
            </Typography.Text>
            <Typography.Text type="secondary" className="d-block">
              {data?.mobile}
            </Typography.Text>
            <Typography.Text type="secondary">{data?.email}</Typography.Text>
          </div>

          <Tag className="py-2 border-none d-block ma-0">
            <Row justify="space-between">
              <div>
                <Typography.Text
                  className="d-block uppercase text-xs"
                  type="secondary"
                >
                  Role
                </Typography.Text>
                <Tag
                  className="uppercase border-none"
                  color={
                    data?.userRole?.toLowerCase() === "admin"
                      ? "magenta"
                      : "gold"
                  }
                >
                  {data?.userRole?.toUpperCase()}
                </Tag>
              </div>

              <div className="text-right">
                <Typography.Text
                  type="secondary"
                  className="d-block uppercase text-xs"
                >
                  status
                </Typography.Text>
                <Tag
                  color={!data?.blocked ? "success" : "error"}
                  className="uppercase border-none mr-0"
                >
                  {!data?.blocked ? (
                    <span>
                      <MdCheck className="mr-1 anticon" />
                      active
                    </span>
                  ) : (
                    <span>
                      <MdOutlineBlock className="mr-1 anticon" />
                      inactive
                    </span>
                  )}
                </Tag>
              </div>
            </Row>
          </Tag>
        </Row>
      </Row>
    </Card>
  );
};

export default UserCard;
