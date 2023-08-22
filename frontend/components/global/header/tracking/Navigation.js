import React from "react";
import { Menu } from "antd";
import { usePublicData } from "../../../../hooks/data/useSettingData";

function getFullPath(url) {
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  if (!/www\./i.test(url)) {
    url = url.replace(/(https?:\/\/)/i, "$1www.");
  }

  return url;
}
const Navigation = ({ mode, className, style }) => {
  const { data } = usePublicData();

  return (
    <Menu style={style} className={className} mode={mode}>
      {data?.data?.data?.attributes?.links?.map((link) => (
        <Menu.Item key={link.id}>
          <a
            href={getFullPath(link.href)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{link.label}</span>
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default Navigation;
