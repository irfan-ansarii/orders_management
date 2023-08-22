import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Drawer, theme, Badge } from "antd";
import { MdWest, MdSearch } from "react-icons/md";
import useQuery from "../../../../../hooks/useQuery";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/router";
const HeaderSearch = () => {
  const router = useRouter();
  const { value, onChange } = useQuery();
  const [open, setOpen] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const debounced = useDebouncedCallback((value) => {
    if (router.isReady) onChange({ key: "search", value: value });
  }, 500);

  const handleSearch = (value) => {
    setSearchTerm(value);
    debounced(value);
  };

  const ref = useRef(null);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const searchValue = new URLSearchParams(window.location.search).get(
      "search"
    );

    setSearchTerm(searchValue);
    debounced(searchValue);
  }, []);

  return (
    <>
      <Badge offset={[-12, 10]} dot count={value.search ? 1 : 0}>
        <Button
          icon={<MdSearch />}
          className="btn-action"
          size="large"
          type="text"
          onClick={() => {
            setOpen(!open);
          }}
        ></Button>
      </Badge>
      <Drawer
        autoFocus
        destroyOnClose
        placement="top"
        height={54}
        mask={false}
        open={open}
        onClose={() => {
          setOpen(false);
          onChange({ key: "search", value: "" });
        }}
        contentWrapperStyle={{ transform: "" }}
        headerStyle={{
          padding: "0 ",
          flex: "0 0 54px",
          border: "none",
          background: colorBgContainer,
        }}
        bodyStyle={{ display: "none" }}
        push={0}
        afterOpenChange={() => {
          ref.current.focus();
          ref.current.value = searchTerm;
        }}
        closeIcon={
          <Button
            icon={<MdWest className="text-lg" />}
            className="btlink pl-4 d-flex align-center"
            size="large"
            type="ghost"
          />
        }
        title={
          <Input
            allowClear
            ref={ref}
            size="large"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-none pa-0 pr-4 search-input"
            placeholder="Search..."
            suffix={
              <MdSearch className="text-lg" onClick={() => setOpen(false)} />
            }
          ></Input>
        }
      />
    </>
  );
};

export default HeaderSearch;
