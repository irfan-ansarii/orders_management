import { Card, Row, Typography, Tag, Image, Skeleton } from "antd";
import numeral from "numeral";
import { getMediaURL } from "../../../../utils";
import { useRouter } from "next/router";
const ProductCard = ({ data, loading }) => {
  const router = useRouter();
  const getFirstVariant = () => {
    const sorted = data?.attributes?.variants?.data?.sort(
      (a, b) => a.attributes.price - b.attributes.price
    );
    return sorted?.length > 0 ? sorted[0] : {};
  };
  const getStock = () => {
    return data?.attributes?.variants?.data?.reduce(
      (total, item) => total + parseInt(item?.attributes?.stock || 0),
      0
    );
  };
  const getMedia = () => {
    return getMediaURL(
      data?.attributes?.image?.data?.attributes?.formats?.small?.url
    );
  };
  const getSoldCount = () => {
    return data?.attributes?.variants?.data?.reduce(
      (total, item) => total + parseInt(item?.attributes?.sold || 0),
      0
    );
  };
  const isOnSale = () => {
    return data?.attributes?.variants?.data?.every(
      (item) => item.attributes.price > item.attributes.salePrice
    );
  };
  const onClick = () => {
    if (router.isReady) router.push(`/products/${data?.id}`);
  };
  return (
    <Card
      bordered={false}
      className="mb-6 overflow-hidden pa-2 pointer"
      size="small"
      loading={loading}
      onClick={onClick}
    >
      <Row className="gap-4" wrap={false}>
        <div className="flex-shrink-0">
          {getMedia() ? (
            <Image
              width={114}
              height={140}
              className="rounded object-cover"
              src={getMedia()}
              placeholder={
                <Skeleton.Image
                  active
                  className="w-100 h-100"
                  style={{ height: "140px" }}
                />
              }
              preview={false}
            />
          ) : (
            <Skeleton.Image style={{ height: "140px", width: "114px" }} />
          )}
        </div>

        <Row className="flex-column justify-space-between flex-grow-1">
          <div className="w-100">
            <Typography.Text ellipsis className="d-block">
              {data?.attributes?.name}
            </Typography.Text>
            <Typography.Text type="secondary">
              {getFirstVariant().attributes?.sku || "NA"}
            </Typography.Text>
          </div>
          <div className="d-flex justify-space-between">
            {getStock() > 0 ? (
              <Tag color="success" className="mr-0 uppercase border-none">
                in stock
              </Tag>
            ) : (
              <Tag color="error" className="mr-0 uppercase border-none">
                out of stock
              </Tag>
            )}
            {isOnSale() && (
              <Tag color="cyan" className="mr-0 uppercase border-none">
                sale
              </Tag>
            )}
          </div>
          <Tag className="py-2 border-none d-block ma-0">
            <Row justify="space-between">
              <div>
                <Typography.Text
                  className="d-block uppercase text-xs"
                  type="secondary"
                >
                  Price
                </Typography.Text>
                {getFirstVariant().attributes?.price >
                  getFirstVariant().attributes?.salePrice && (
                  <Typography.Text type="secondary" delete className="mr-2">
                    {numeral(getFirstVariant().attributes?.price).format(
                      "0.00"
                    )}
                  </Typography.Text>
                )}
                <Typography.Text type="success">
                  {numeral(getFirstVariant().attributes?.salePrice).format(
                    "0.00"
                  )}
                </Typography.Text>
              </div>
              <div className="text-right">
                <Typography.Text
                  type="secondary"
                  className="d-block uppercase text-xs"
                >
                  Sold
                </Typography.Text>
                <Typography.Text>{getSoldCount()}</Typography.Text>
              </div>
            </Row>
          </Tag>
        </Row>
      </Row>
    </Card>
  );
};
export default ProductCard;
ProductCard.defaultProps = {
  data: {},
  loading: false,
};
