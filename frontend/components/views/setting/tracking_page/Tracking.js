import React from "react";
import { Card, List, Skeleton, Button } from "antd";
import NewNav from "./NewNav";
import EditNav from "./EditNav";
import DeleteNav from "./DeleteNav";
import { usePublicData } from "../../../../hooks/data/useSettingData";

const Tracking = () => {
  const { isLoading, data } = usePublicData();

  return (
    <Card bordered={false}>
      <List
        itemLayout="horizontal"
        dataSource={data?.data?.data?.attributes?.links}
        rowKey="id"
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button.Group key={item.id}>
                <EditNav
                  links={data?.data?.data?.attributes?.links}
                  index={index}
                />
                <DeleteNav
                  links={data?.data?.data?.attributes?.links}
                  index={index}
                />
              </Button.Group>,
            ]}
          >
            <Skeleton avatar title={false} loading={isLoading} active>
              <List.Item.Meta
                title={item.label}
                description={<a href={item.href}>{item.href}</a>}
              />
            </Skeleton>
          </List.Item>
        )}
      />
      <NewNav links={data?.data?.data?.attributes?.links} />
    </Card>
  );
};

export default Tracking;
