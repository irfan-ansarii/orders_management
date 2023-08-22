import React, { useRef, useEffect, useState } from "react";
import { Input, Tag, Modal } from "antd";
import SearchResults from "./SearchResults";
import { useDebounce } from "use-debounce";
const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedValue] = useDebounce(searchTerm, 1000);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();

        setOpen(true);
      } else if (event.which === 27) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Input
        className={`header-search-bar w-100`}
        allowClear
        value={searchTerm}
        onFocus={() => setOpen(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="large"
        placeholder="Search here..."
        suffix={<Tag className="mr-0 border-none input-icon">⌘ K</Tag>}
      ></Input>

      <Modal
        open={open}
        destroyOnClose={true}
        closeIcon={""}
        footer={null}
        afterClose={() => setOpen(false)}
        title={
          <Input
            className={`header-search-bar w-100`}
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="large"
            placeholder="Search here..."
          ></Input>
        }
      >
        <SearchResults searchTerm={debouncedValue} />
      </Modal>
    </>
  );
};

export default Search;
