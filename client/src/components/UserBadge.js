import React, { Component } from "react";
const UserBadge = props => {
  return (
    <div className="user-badge" style={{ backgroundColor: "blue" }}>
      <span className="user-initial">{props.userName.charAt(0)}</span>
    </div>
  );
};

export default UserBadge;
