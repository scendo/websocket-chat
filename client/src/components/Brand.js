import React from "react";
import { Header, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Brand = () => (
  <Link to="/">
    <h1 className="brand">
      <Icon name="comments" />
      CONVOLINK
    </h1>
  </Link>
);

export default Brand;
