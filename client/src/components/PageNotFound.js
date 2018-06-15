import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";

const PageNotFound = props => {
  return (
    <div id="page-not-found">
      <div className="content">
        <div className="header-txt">Hang In There</div>
        <div className="body-txt">404 Page Not Found</div>
        <Icon name="cloud" size="massive" style={{ color: "#fff" }} />
      </div>
    </div>
  );
};

export default PageNotFound;
