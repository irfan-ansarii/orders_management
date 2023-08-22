import React, { useState, useRef } from "react";
import { Input, Button, Drawer, Tag } from "antd";
import { MdSearch, MdWest } from "react-icons/md";
import { useTheme } from "../../../../../context/useTheme";
import SearchResults from "./SearchResults";
import { useDebounce } from "use-debounce";

const SearchDrawer = () => {
  const [open, setOpen] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedValue] = useDebounce(searchTerm, 1000);
  const { mode, screen } = useTheme();

  const ref = useRef(null);

  return (
    <>
      {screen.lg ? (
        <Input
          className={`header-search-bar w-100`}
          allowClear
          value={searchTerm}
          onClick={() => setOpen(true)}
          size="large"
          placeholder="Search here..."
          suffix={<Tag className="mr-0 border-none input-icon">⌘ K</Tag>}
        ></Input>
      ) : (
        <Button
          icon={<MdSearch />}
          size="large"
          type="text"
          onClick={() => {
            setOpen(!open);
          }}
        />
      )}
      <Drawer
        autoFocus
        className={`search-drawer mode-${mode}`}
        afterOpenChange={() => {
          ref.current.focus();
          ref.current.value = searchTerm;
        }}
        title={
          <Input
            ref={ref}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            className="border-none"
            placeholder="Search here..."
            suffix={<MdSearch className="text-lg" />}
          ></Input>
        }
        closeIcon={<MdWest className="text-lg" />}
        placement="left"
        width={screen.lg ? "400px" : "100%"}
        onClose={() => setOpen(false)}
        open={open}
      >
        <SearchResults searchTerm={debouncedValue} />
      </Drawer>
    </>
  );
};

export default SearchDrawer;
