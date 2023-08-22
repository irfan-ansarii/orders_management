import React, { useState, useEffect } from "react";
import { useTheme } from "../../../context/useTheme";
import useQuery from "../../../hooks/useQuery";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import {
  Button,
  Row,
  Col,
  Popover,
  Divider,
  Tag,
  Typography,
  Drawer,
  Select,
} from "antd";
import {
  MdChevronLeft,
  MdChevronRight,
  MdCalendarMonth,
  MdExpandMore,
} from "react-icons/md";

const DateFilter = ({
  defaultValue,
  size,
  placement,
  btnType,
  btnClassName,
}) => {
  const { mode, screen } = useTheme();
  const { value, onChange } = useQuery();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState(defaultValue);

  const predefinedRanges = [
    {
      value: 1,
      label: "Today",
      range: [new Date(), new Date()],
    },
    {
      value: 2,
      label: "Yesterday",
      range: [
        moment().subtract("1", "days").toDate(),
        moment().subtract("1", "days").toDate(),
      ],
    },
    {
      value: 3,
      label: "Last 7 Days",
      range: [moment().subtract("6", "days").toDate(), new Date()],
    },
    {
      value: 4,
      label: "Last 30 Days",
      range: [moment().subtract("29", "days").toDate(), new Date()],
    },
    {
      value: 5,
      label: "Last 90 Days",
      range: [moment().subtract("89", "days").toDate(), new Date()],
    },
    {
      value: 6,
      label: "This Month",
      range: [moment().startOf("month").toDate(), new Date()],
    },
    {
      value: 7,
      label: "Last Month",
      range: [
        moment().subtract("1", "month").startOf("month").toDate(),
        moment().subtract("1", "month").endOf("month").toDate(),
        ,
      ],
    },
    {
      value: 8,
      label: "This Year",
      range: [moment().startOf("year").toDate(), new Date(), ,],
    },
    {
      value: 9,
      label: "Last Year",
      range: [
        moment().subtract("1", "year").startOf("year").toDate(),
        moment().subtract("1", "year").endOf("year").toDate(),
        ,
      ],
    },
  ];
  // handle apply
  const handleApply = () => {
    const start = moment(dateRange?.[0]).format("YYYY-MM-DD");
    const end = moment(dateRange?.[1]).format("YYYY-MM-DD");

    setOpen(!open);
    onChange({
      key: "range",
      value: dateRange?.[1] ? `${start},${end}` : "",
      replace: false,
    });
  };
  // handle cancel
  const handleCancel = () => {
    setOpen(false);
    if (defaultValue?.[0]) {
      const date = moment(new Date()).format("YYYY-MM-DD");
      onChange({ key: "range", value: `${date},${date}`, replace: false });

      setDateRange([new Date(), new Date()]);
      return;
    }
    onChange({ key: "range", value: "", replace: false });

    setDateRange([null, null]);
  };

  // get button label
  const getLabel = () => {
    let activeElement = null;
    if (dateRange?.[0] || dateRange?.[1]) {
      activeElement = predefinedRanges.find(
        (element) =>
          moment(element.range[0]).isSame(dateRange?.[0], "day") &&
          moment(element.range[1]).isSame(dateRange?.[1], "day")
      );
    }
    if (activeElement) return activeElement.label;

    return (
      <>
        {dateRange?.[0]
          ? moment(dateRange?.[0]).format("DD-MM-YYYY")
          : "DD-MM-YYYY"}
        {" - "}
        {dateRange?.[1]
          ? moment(dateRange?.[1]).format("DD-MM-YYYY")
          : "DD-MM-YYYY"}
      </>
    );
  };
  // get open date
  const getOpenDate = () => {
    let returnDate = moment().subtract(1, "month");

    const prevMonth = moment(dateRange?.[1]).add(1, "month");

    if (dateRange?.[1] && !prevMonth.isSame(moment(), "month")) {
      returnDate = moment(dateRange?.[1]).subtract(1, "month");
    }
    return returnDate.toDate();
  };

  useEffect(() => {
    let range = value?.range;

    if (range) {
      const selectedRange = [
        new Date(range?.split(",")?.[0]),
        new Date(range?.split(",")?.[1]),
      ];
      setDateRange(selectedRange);
    }
  }, [router]);

  useEffect(() => {
    let range = value?.range;
    if (range && router.isReady) {
      const startDate = new Date(range?.split(",")?.[0]);
      const endDate = new Date(range?.split(",")?.[1]);
      const startString = moment(startDate).format("YYYY-MM-DD");
      const endString = moment(endDate).format("YYYY-MM-DD");
      onChange({ key: "range", value: `${startString},${endString}` });
      setDateRange([startDate, endDate]);
    } else if (!range && router.isReady && dateRange && dateRange.length > 1) {
      const startString = moment(dateRange[0]).format("YYYY-MM-DD");
      const endString = moment(dateRange[1]).format("YYYY-MM-DD");
      onChange({ key: "range", value: `${startString},${endString}` });
    }
  }, []);

  return (
    <>
      {/* calander button */}
      <Button
        block
        size={size}
        type={btnType}
        className={`align-center justify-start ${btnClassName}`}
        onClick={() => setOpen(!open)}
        icon={<MdCalendarMonth className="text-lg input-icon anticon" />}
      >
        <Typography.Text className="ml-1" type="secondary">
          {getLabel()}
        </Typography.Text>
      </Button>

      {/* mobile calander drawer */}
      {!screen.lg && (
        <Drawer
          autoFocus
          destroyOnClose
          headerStyle={{ display: "none" }}
          contentWrapperStyle={{
            borderTopLeftRadius: ".5rem",
            borderTopRightRadius: ".5rem",
            overflow: "hidden",
          }}
          bodyStyle={{ padding: "1rem" }}
          placement="bottom"
          height="auto"
          push={0}
          onClose={() => setOpen(false)}
          open={open}
          className={`${mode === "light" ? "mode-light" : "mode-dark"}`}
        >
          <Select
            options={predefinedRanges}
            placeholder={getLabel()}
            value={null}
            suffixIcon={<MdExpandMore className="text-lg" />}
            placement="bottomLeft"
            className="w-100 mb-4 uppercase"
            onChange={(e) => {
              const index = e - 1;
              setDateRange(predefinedRanges[index]?.range);
            }}
          />

          <DatePicker
            startDate={dateRange?.[0] || null}
            endDate={dateRange?.[1] || null}
            onChange={(date) => setDateRange(date)}
            maxDate={new Date()}
            openToDate={dateRange?.[1] || new Date()}
            inline
            selectsRange
            renderCustomHeader={({
              monthDate,
              decreaseMonth,
              increaseMonth,
            }) => (
              <Row align="middle" className="px-1 mb-2">
                <Button
                  className="text-button d-flex align-center justify-center"
                  onClick={decreaseMonth}
                  icon={<MdChevronLeft className="anticon text-lg" />}
                />

                <Col flex="1 1 auto" className="text-xs font-medium uppercase">
                  {moment(monthDate).format("MMMM YYYY")}
                </Col>

                <Button
                  className="text-button d-flex align-center justify-center"
                  onClick={increaseMonth}
                  icon={<MdChevronRight className="anticon text-lg" />}
                ></Button>
              </Row>
            )}
          />

          <Divider className="my-4" />
          <Row gutter={12}>
            <Col span={12}>
              <Button block onClick={handleCancel}>
                Clear
              </Button>
            </Col>
            <Col span={12}>
              <Button block type="primary" onClick={handleApply}>
                Apply
              </Button>
            </Col>
          </Row>
        </Drawer>
      )}
      {/* desktop calander popover */}
      {screen.lg && (
        <Popover
          autoAdjustOverflow={false}
          overlayClassName={mode === "light" ? "mode-light" : "mode-dark"}
          trigger="click"
          zIndex={999}
          placement={placement}
          onOpenChange={() => setOpen(open)}
          open={open}
          content={
            <>
              <Row wrap={false}>
                <Col style={{ width: "130px" }}>
                  {predefinedRanges?.map((range) => (
                    <Tag.CheckableTag
                      key={range.value}
                      className="d-block mb-2 py-1 uppercase"
                      onChange={() => setDateRange(range.range)}
                      checked={
                        moment(range.range?.[0]).isSame(
                          dateRange?.[0],
                          "day"
                        ) &&
                        moment(range.range?.[1]).isSame(dateRange?.[1], "day")
                      }
                    >
                      {range.label}
                    </Tag.CheckableTag>
                  ))}
                </Col>
                <Col className="daterange-picker-conatiner">
                  <DatePicker
                    startDate={dateRange?.[0] || null}
                    endDate={dateRange?.[1] || null}
                    onChange={(date) => setDateRange(date)}
                    monthsShown={2}
                    maxDate={new Date()}
                    openToDate={getOpenDate()}
                    inline
                    selectsRange
                    renderCustomHeader={({
                      monthDate,
                      customHeaderCount,
                      decreaseMonth,
                      increaseMonth,
                    }) => (
                      <Row align="middle" className="px-1 mb-2">
                        <Button
                          className={
                            customHeaderCount === 1
                              ? "d-none"
                              : "text-button d-flex align-center justify-center"
                          }
                          onClick={decreaseMonth}
                          icon={<MdChevronLeft className="anticon text-lg" />}
                        />

                        <Col
                          flex="1 1 auto"
                          className="text-xs font-medium uppercase"
                        >
                          {moment(monthDate).format("MMMM YYYY")}
                        </Col>

                        <Button
                          className={
                            customHeaderCount === 0
                              ? "d-none"
                              : "text-button d-flex align-center justify-center"
                          }
                          onClick={increaseMonth}
                          icon={<MdChevronRight className="anticon text-lg" />}
                        ></Button>
                      </Row>
                    )}
                  />
                </Col>
              </Row>
              <Divider className="my-3" />
              <Row justify="space-between" align="middle">
                <div>
                  <Tag className="py-1 px-4">
                    {dateRange?.[0]
                      ? moment(dateRange?.[0]).format("DD-MM-YYYY")
                      : "DD-MM-YYYY"}
                  </Tag>

                  <Tag className="py-1 px-4">
                    {dateRange?.[1]
                      ? moment(dateRange?.[1]).format("DD-MM-YYYY")
                      : "DD-MM-YYYY"}
                  </Tag>
                </div>
                <div>
                  <Button onClick={handleCancel}>Clear</Button>
                  <Button className="ml-4" type="primary" onClick={handleApply}>
                    Apply
                  </Button>
                </div>
              </Row>
            </>
          }
        ></Popover>
      )}
    </>
  );
};

export default DateFilter;

DateFilter.defaultProps = {
  defaultValues: [null, null],
  size: "default",
  placement: "bottomLeft",
};
