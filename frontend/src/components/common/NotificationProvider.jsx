import React, { createContext, useContext } from "react";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "./NotificationContainer";

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

const NotificationProvider = ({ children }) => {
  const notificationUtils = useNotification();

  return (
    <NotificationContext.Provider value={notificationUtils}>
      {children}
      <NotificationContainer
        notifications={notificationUtils.notifications}
        onRemove={notificationUtils.removeNotification}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

