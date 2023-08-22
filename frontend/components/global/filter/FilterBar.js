import React, { useState, useEffect } from "react";
import { Card, Row } from "antd";
const FilterBar = ({ className, children }) => {
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const isVisible =
        prevScrollPos > currentScrollPos || currentScrollPos < 100;

      setShowSearchBar(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    <Card
      bordered={false}
      className={`filter-bar ${className}`}
      style={{
        transition: "transform 0.3s ease-in-out",
        transform: `translateY(${showSearchBar ? "0" : "-100%"})`,
      }}
      size="small"
    >
      <Row gutter={12}>{children}</Row>
    </Card>
  );
};

export default FilterBar;
