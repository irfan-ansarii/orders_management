import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Menu, Skeleton, Space } from "antd";
import { ADMIN_MENU, RIDER_MENU } from "../../../utils/_MENU";
import { useSession } from "../../../context/useSession";
const Navigation = ({ setCollapsed }) => {
  const router = useRouter();
  const [menuType, setMenuType] = useState(null);
  const { user, session } = useSession();

  useEffect(() => {
    if (!menuType) {
      if (user?.userRole === "admin") {
        setMenuType(ADMIN_MENU);
        return;
      }
      if (user?.userRole === "rider") {
        setMenuType(RIDER_MENU);
        return;
      }
    }
  }, [session]);

  const onClick = (e) => {
    router.push(`/${e.keyPath?.[0]}`);
    setCollapsed(true);
  };
  return (
    <>
      {!menuType && (
        <div className="px-2 d-flex flex-column gap-4">
          {[...Array(10)].map((el, i) => (
            <Skeleton.Button key={i} active size="large" block />
          ))}
        </div>
      )}
      <Menu
        mode="inline"
        className="uppercase font-medium text-xs border-none"
        items={menuType}
        onClick={onClick}
      />
    </>
  );
};

export default Navigation;
