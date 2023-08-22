import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Tooltip,
  Tag,
  List,
  Button,
} from "antd";
import { useRouter } from "next/router";
import numeral from "numeral";
import moment from "moment";
import { getMediaURL } from "../../../utils";
import StatusTag from "../orders/all/StatusTag";
const LocalDeliveryCard = ({ localDelivery, loading }) => {
  const router = useRouter();

  return (
    <Card
      bordered={false}
      className="h-100 table-card"
      title="Local Delivery"
      loading={loading}
    >
      {(!localDelivery || localDelivery.length === 0) && (
        <List className="px-4 py-4 has-hover" dataSource={localDelivery} />
      )}

      {localDelivery?.slice(0, 5)?.map((item) => (
        <Tag
          className="border-none d-block mr-0 py-2 px-6 mb-2 pointer"
          onClick={() => router.push(`/orders/${item.id}`)}
          key={item.id}
        >
          <Row align="top" gutter={12} justify="space-between" wrap={false}>
            <Col span={6}>
              <Typography.Text ellipsis className="d-block">
                {item.attributes.name}
              </Typography.Text>
              <Typography.Text type="secondary">
                {moment(
                  item.attributes.orderDate || item.attributes.createdAt
                ).format("DD MMM, YYYY")}
              </Typography.Text>
            </Col>
            <Col span={7} className="d-flex">
              <Avatar.Group maxCount={2} size={40}>
                {item?.attributes?.lineItems?.data.map((line, i) => {
                  const imageSrc = getMediaURL(
                    line?.attributes?.product?.data?.attributes?.image?.data
                      ?.attributes?.formats?.thumbnail?.url || ""
                  );
                  return (
                    <Tooltip title={line?.attributes?.name} key={i}>
                      <Avatar src={imageSrc} />
                    </Tooltip>
                  );
                })}
              </Avatar.Group>
            </Col>
            <Col span={5}>
              <Typography.Text className="d-block uppercase">
                {item.attributes.paymentMode}
              </Typography.Text>

              <Tag
                color={
                  item?.attributes?.paymentMode === "prepaid"
                    ? "success"
                    : "orange"
                }
                className="mr-0 uppercase d-inline-flex align-center border-none"
              >
                {numeral(item?.attributes?.total).format("0,0.00")}
              </Tag>
            </Col>
            <Col span={6} className="text-right">
              <StatusTag data={item} />
            </Col>
          </Row>
        </Tag>
      ))}
      {localDelivery?.length > 1 && (
        <Button className="mt-2" block type="link">
          View All
        </Button>
      )}
    </Card>
  );
};

export default LocalDeliveryCard;
LocalDeliveryCard.defaultProps = {
  localDelivery: [],
  loading: false,
};
