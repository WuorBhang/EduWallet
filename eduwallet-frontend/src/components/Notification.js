import React, { useEffect, useState } from 'react';
import { getNotifications } from '../services/notificationService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };
    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id}>
          <p>{notification.message}</p>
          <small>{new Date(notification.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default Notifications;