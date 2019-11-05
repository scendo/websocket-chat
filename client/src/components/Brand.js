import React from "react";
import { Header, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Brand = () => (
  <Link to="/">
    <Header className="brand" as="h1" textAlign="center">
      <Icon name="comments" />
      CONVOLINK
    </Header>
  </Link>
);

export default Brand;
