import React from "react";
import { Col } from "antd";
import TrackLayout from "../../layouts/TrackLayout";
import TrackForm from "../../components/views/track/TrackForm";
import FormTitle from "../../components/form/FormTitle";

const Tracking = () => {
  return (
    <>
      <Col flex="0 0 auto" className="mt-16">
        <FormTitle
          title="Track your order"
          desc="Enter your Order ID or AWB number bellow to track the status of your order."
        />
      </Col>
      <Col flex="1 1 auto" className="overflow-y-auto">
        <TrackForm />
      </Col>
    </>
  );
};

export default Tracking;

Tracking.getLayout = (page) => <TrackLayout>{page}</TrackLayout>;
