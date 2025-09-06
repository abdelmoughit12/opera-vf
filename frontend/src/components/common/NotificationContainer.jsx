import React from "react";
import NotificationToast from "./NotificationToast";

const NotificationContainer = ({ notifications, onRemove }) => {
  return (
    <>
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </>
  );
};

export default NotificationContainer;

