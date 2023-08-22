import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { MdSearch } from "react-icons/md";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/router";
import useQuery from "../../../hooks/useQuery";

const SearchInput = ({ size, style }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const { onChange } = useQuery();
  const debounced = useDebouncedCallback((value) => {
    if (router.isReady) {
      onChange({ key: "search", value: value });
    }
  }, 500);

  const handleSearch = (value) => {
    setSearchTerm(value);
    debounced(value);
  };

  useEffect(() => {
    var searchValue = new URLSearchParams(window.location.search).get("search");
    setSearchTerm(searchValue);
    debounced(searchValue);
  }, []);

  useEffect(() => {
    var searchValue = new URLSearchParams(window.location.search).get("search");
    if (router.isReady && !searchValue) {
      setSearchTerm("");
    }
  }, [router.query]);

  return (
    <Input
      allowClear
      size={size}
      prefix={<MdSearch className="input-icon text-lg" />}
      placeholder="Search..."
      onChange={(e) => handleSearch(e.target.value)}
      value={searchTerm}
      style={style}
    ></Input>
  );
};

export default SearchInput;

SearchInput.defaultProps = {
  size: "large",
  style: {},
};
