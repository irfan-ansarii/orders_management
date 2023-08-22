import React from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../context/useTheme";
import SimpleBar from "simplebar-react";
import { Row, theme, Drawer, Typography, Segmented, Col } from "antd";
import { MdLightMode, MdNightlight, MdWest } from "react-icons/md";
import Navigation from "./Navigation";

const MobileDrawer = ({ open, setOpen, title }) => {
  const { mode, onChange, screen } = useTheme();

  return (
    <Drawer
      title={title}
      placement="left"
      destroyOnClose={true}
      open={open}
      width={screen.md ? "260" : "85%"}
      onClose={() => setOpen(false)}
      closeIcon={<MdWest className="text-lg" />}
      bodyStyle={{ padding: 0 }}
      headerStyle={{ paddingBlock: "10px" }}
    >
      <Row className="flex-column h-100 flex-nowrap">
        <SimpleBar className="flex-fill overflow-y-auto simple-bar">
          <Navigation
            mode="inline"
            style={{
              border: "none",
              background: "transparent",
            }}
            className="justify-center uppercase font-medium"
          />
        </SimpleBar>
        <Col className="pb-4 pl-2 pr-2" flex="0 0 auto">
          <Segmented
            size="large"
            options={[
              {
                icon: <MdLightMode className="anticon text-md" />,
                label: "Light",
                value: "light",
              },
              {
                icon: <MdNightlight className="anticon text-md" />,
                label: "Dark",
                value: "dark",
              },
            ]}
            block
            onChange={onChange}
            defaultValue={mode}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default MobileDrawer;
