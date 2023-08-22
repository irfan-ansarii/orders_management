import React, { useState, useEffect } from "react";
import { Row, Button } from "antd";

const OrderAction = ({ data }) => {
  const [isReturnable, setIsReturnable] = useState(false);
  const [helpMessage, setHelpMessage] = useState("My");

  const handleReturnable = () => {};
  const handleMessage = () => {
    console.log("first");
  };
  useEffect(() => {
    handleReturnable();
    handleMessage();
  }, [data]);

  const hanldeHelpClick = () => {
    const { type, name, cancelledAt, total } = data?.attributes;
    const currentStatus =
      data?.attributes?.currentStatus?.data?.attributes?.name || "Processing";

    const BASE_URL = "https://api.whatsapp.com/send";
    const PHONE = "918882438536";

    const MESSAGE = `Hi, I have a few queries regarding my order ${name}.`;

    window.open(`${BASE_URL}?phone=${PHONE}&text=${MESSAGE}`, "_blank");
  };

  return (
    <Row className="gap-4">
      {isReturnable && (
        <div style={{ flex: 1 }}>
          <Button
            type="text"
            block
            danger
            className="text-button text-xs uppercase mt-6"
          >
            Return
          </Button>
        </div>
      )}

      <div style={{ flex: 1 }}>
        <Button
          type="text"
          block
          className="text-button text-xs uppercase mt-6"
          onClick={() => hanldeHelpClick()}
        >
          Need Help?
        </Button>
      </div>
    </Row>
  );
};

export default OrderAction;
