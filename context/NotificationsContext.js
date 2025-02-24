import React, { createContext, useState, useEffect } from "react";
import * as Notifications from "expo-notifications";

export const NotificationsContext = createContext();

// Proveedor del Context
export const NotificationsProvider = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  // Escuchar notificaciones entrantes cuando la app está en primer plano
  useEffect(() => {
    const foregroundSubscription = Notifications.addNotificationReceivedListener((notification) => {
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => foregroundSubscription.remove();
  }, []);

  // Escuchar notificaciones cuando el usuario toca una notificación para abrir la app
  useEffect(() => {
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => responseSubscription.remove();
  }, []);

  // Sincronizar el badge count y las notificaciones pendientes al abrir la app
  useEffect(() => {
    const syncNotifications = async () => {
      // Obtener el badge count actual
      const badgeCount = await Notifications.getBadgeCountAsync();
      setNotificationCount(badgeCount);

      // Obtener notificaciones presentadas (que llegaron mientras la app estaba cerrada o en segundo plano)
      const presentedNotifications = await Notifications.getPresentedNotificationsAsync();
      if (presentedNotifications.length > 0) {
        setNotificationCount(presentedNotifications.length);
      }
    };

    syncNotifications();
  }, []);

  // Función para limpiar las notificaciones
  const clearNotifications = async () => {
    await Notifications.setBadgeCountAsync(0); // Limpiar el badge count
    setNotificationCount(0); // Reiniciar el contador
  };

  return (
    <NotificationsContext.Provider value={{ notificationCount, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};