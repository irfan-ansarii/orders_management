import React from "react";
import { Button, Row } from "antd";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import useQuery from "../../../hooks/useQuery";
const Pagination = ({ pagination }) => {
  const { page, pageCount } = pagination || {};
  const { onChange } = useQuery();
  if (pageCount === 1) {
    return;
  }
  return (
    <Row justify="center" className="gap-2 mb-6" align="middle">
      <Button.Group size="large" type="text">
        <Button
          className="text-button"
          icon={<BsChevronLeft className="anticon" />}
          disabled={page === 1}
          onClick={() =>
            onChange({
              key: "page",
              value: page > 2 ? page - 1 : "",
              replace: false,
            })
          }
        />
        <Button className="text-button cursor-default" disabled>
          {`${page}  / ${pageCount}`}
        </Button>

        <Button
          icon={<BsChevronRight className="anticon" />}
          className="text-button"
          disabled={page === pageCount}
          onClick={() =>
            onChange({ key: "page", value: page + 1, replace: false })
          }
        />
      </Button.Group>
    </Row>
  );
};

export default Pagination;
