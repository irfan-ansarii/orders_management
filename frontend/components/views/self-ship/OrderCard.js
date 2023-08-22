import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Tag,
  Avatar,
  Tooltip,
  Badge,
} from "antd";
import { MdOutlineStickyNote2 } from "react-icons/md";
import moment from "moment";
import capitalize from "capitalize";
import numeral from "numeral";
import { getMediaURL } from "../../../utils";
import { useRouter } from "next/router";
import { RiImage2Fill } from "react-icons/ri";
import StatusTag from "../orders/all/StatusTag";

const OrderCard = ({ data, loading }) => {
  const router = useRouter();

  return (
    <Badge.Ribbon
      color={
        data?.attributes?.type === "return"
          ? "red"
          : data?.attributes?.type === "exchange"
          ? "geekblue"
          : "cyan"
      }
      text={data?.attributes?.type}
      className="rotate"
    >
      <Card
        bordered={false}
        className="overflow-hidden pa-2 pointer"
        loading={loading}
        size="small"
        onClick={() => !loading && router.push(`/orders/${data?.id}`)}
      >
        <Space direction="vertical" className="w-100" size="middle">
          <Row align="top" gutter={12} justify="space-between" wrap={false}>
            <Col span={8}>
              <Typography.Text ellipsis className="d-block">
                {data?.attributes?.name}
                {data?.attributes?.note && (
                  <Tooltip
                    title={data?.attributes?.note}
                    placement="bottom"
                    width="200px"
                  >
                    <Typography.Text type="secondary">
                      <MdOutlineStickyNote2 className="ml-2" />
                    </Typography.Text>
                  </Tooltip>
                )}
              </Typography.Text>
              <Typography.Text type="secondary">
                {moment(data?.attributes?.orderDate).format("DD MMM,YYYY")}
              </Typography.Text>
            </Col>
            <Col span={8}>
              <Typography.Text className="d-block" ellipsis>
                {capitalize(
                  data?.attributes?.shippingAddress?.name ||
                    data?.attributes?.billingAddress?.name ||
                    data?.attributes?.customer?.data?.attributes?.name ||
                    ""
                )}
              </Typography.Text>

              <Typography.Text type="secondary" ellipsis>
                {data?.attributes?.shippingAddress?.phone ||
                  data?.attributes?.billingAddress?.phone ||
                  data?.attributes?.customer?.data?.attributes?.phone}
              </Typography.Text>
            </Col>
            <Col span={8} className="text-right">
              <Typography.Text className="d-block uppercase">
                cod
              </Typography.Text>

              <Tag
                color={
                  data?.attributes?.outstandingTotal > 0 ? "success" : "orange"
                }
                className="mr-0 uppercase d-inline-flex align-center border-none px-2"
              >
                {numeral(data?.attributes?.outstandingTotal).format("0,0.00")}
              </Tag>
            </Col>
          </Row>
          <Tag className="py-2 border-none d-block ma-0">
            <Row justify="space-between" align="middle" gutter={12}>
              <Col span={8} className="d-flex">
                <Avatar.Group maxCount={2} size={40}>
                  {data?.attributes?.lineItems?.data?.map((line) => {
                    const imageSrc = getMediaURL(
                      line?.attributes?.product?.data?.attributes?.image?.data
                        ?.attributes?.formats?.thumbnail?.url || ""
                    );
                    return (
                      <Tooltip
                        title={`${line?.attributes?.name} ${
                          line?.attributes?.variantName && "-"
                        } ${line?.attributes?.variantName}`}
                        key={line.id}
                      >
                        <Avatar
                          src={imageSrc}
                          className="d-inline-flex justify-center align-center"
                          icon={<RiImage2Fill />}
                        />
                      </Tooltip>
                    );
                  })}
                </Avatar.Group>
              </Col>
              <Col span={8}>
                <Typography.Text
                  type="secondary"
                  className="d-block uppercase text-xs"
                >
                  {data?.attributes?.shippingAddress?.country_code !== "IN"
                    ? "country"
                    : "state"}
                </Typography.Text>
                <Typography.Text className=" d-block">
                  {data?.attributes?.shippingAddress?.country_code !== "IN"
                    ? data?.attributes?.shippingAddress?.country
                    : data?.attributes?.shippingAddress?.province ||
                      data?.attributes?.shippingAddress?.city}
                </Typography.Text>
              </Col>
              <Col span={8} className="text-right">
                <StatusTag data={data} />
              </Col>
            </Row>
          </Tag>
        </Space>
      </Card>
    </Badge.Ribbon>
  );
};
export default OrderCard;
OrderCard.defaultProps = {
  data: {},
  loading: false,
};
