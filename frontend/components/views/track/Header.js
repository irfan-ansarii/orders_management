import React from "react";
import { useRouter } from "next/router";
import { Row, Typography, Button } from "antd";
import { MdWest } from "react-icons/md";

const Header = ({ title = "Back" }) => {
  const router = useRouter();
  return (
    <Row style={{ marginBottom: "1rem" }}>
      <Button
        className="btn-action px-0"
        icon={<MdWest className="mr-4" />}
        type="text"
        onClick={() => router.back()}
      >
        <Typography.Text className="uppercase">{title}</Typography.Text>
      </Button>
    </Row>
  );
};

export default Header;
