import * as React from "react";
// import { MenuItemLink, usePermissions } from "react-admin";

const Menu = ({ /*onMenuClick,*/ logout }) => {
  // const { permissions } = usePermissions();
  return (
    <div>
      {/* <MenuItemLink to="/posts" primaryText="Public" onClick={onMenuClick} />
            {permissions && permissions.includes("ROLE_ORGANIZER") &&
                <MenuItemLink to="/organizer-link" primaryText="Organizer Link" onClick={onMenuClick} />
            }
            {permissions && permissions.includes("ROLE_SHAREHOLDER") &&
                <MenuItemLink to="/shareholder-link" primaryText="ShareHolder Link" onClick={onMenuClick} />
            } */}
      <p />
      {logout}
    </div>
  );
};

export default Menu;
