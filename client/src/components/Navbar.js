import React, { Component } from "react";
import { Icon, Menu } from "semantic-ui-react";

const Navbar = props => {
  return (
    <Menu>
      <Menu.Item name="sidebar-menu">
        <Icon name="sidebar" size="large" />
      </Menu.Item>
    </Menu>
  );
};

export default Navbar;
