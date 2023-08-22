import React from "react";
import { Card, List, Skeleton, Avatar, Tag } from "antd";

import NewPlatform from "./NewPlatform";
import EditPlatform from "./EditPlatform";
import { getMediaURL, getAvatarName } from "../../../../utils";
import { usePlatformsData } from "../../../../hooks/data/useSettingData";

const Platforms = () => {
  const { isLoading, data } = usePlatformsData();

  return (
    <Card bordered={false}>
      <List
        itemLayout="horizontal"
        dataSource={data?.data?.data}
        rowKey="id"
        renderItem={(item) => (
          <List.Item actions={[<EditPlatform platform={item} key={item.id} />]}>
            <Skeleton avatar title={false} loading={isLoading} active>
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size={60}
                    src={getMediaURL(
                      item.attributes.logo?.data?.attributes?.formats?.medium
                        ?.url
                    )}
                  >
                    {getAvatarName(item.attributes.name)}
                  </Avatar>
                }
                title={item.attributes.name}
                description={
                  <a href={item.attributes.url}>{item.attributes.url}</a>
                }
              />
              {item.attributes.active ? (
                <Tag className="border-none uppercase px-2" color="pink">
                  Active
                </Tag>
              ) : (
                <Tag className="border-none uppercase px-2" color="red">
                  Inactive
                </Tag>
              )}
            </Skeleton>
          </List.Item>
        )}
      />
      <NewPlatform platforms={data?.data?.data} />
    </Card>
  );
};

export default Platforms;
