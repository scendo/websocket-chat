import React, { Component } from "react";
const UserBadge = props => {
  const { user } = props;
  const badgeColor = user.metaData.badgeColor;

  return (
    <div className="user-badge" style={{ backgroundColor: badgeColor }}>
      <span className="user-initial">{user.name.charAt(0)}</span>
    </div>
  );
};

export default UserBadge;
