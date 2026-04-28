import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Send, Mail, MessageSquare, Tv } from 'lucide-react';

const NotificationGrid = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/demo/notifications');
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const getChannelIcon = (channel) => {
    const icons = {
      sms: '📱',
      email: '✉️',
      push: '🔔',
      pa_system: '📢',
      led_signage: '🖥️',
      slack: '💬'
    };
    return icons[channel] || '📤';
  };

  const getStatusColor = (status) => {
    return status === 'DELIVERED' ? 'text-success' : 'text-danger';
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading notifications...</div>;
  }

  return (
    <div className="bg-dark-card rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold mb-6">Multi-Channel Notifications</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-dark-card-2 rounded-lg p-4 border border-gray-700 animate-fade-in-up"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getChannelIcon(notif.channel)}</span>
                <div>
                  <h4 className="font-semibold capitalize">{notif.channel.replace('_', ' ')}</h4>
                  <p className="text-xs text-gray-500">{notif.recipient}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${getStatusColor(notif.status)}`}>
                {notif.status === 'DELIVERED' ? '✓' : '✗'} {notif.status}
              </span>
            </div>

            <p className="text-sm text-gray-300 mb-3 line-clamp-2">{notif.message}</p>

            <p className="text-xs text-gray-500">
              {new Date(notif.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 p-4 bg-dark-card-2 rounded border border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Sent</p>
          <p className="text-2xl font-bold text-primary">{notifications.length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-success">{notifications.filter(n => n.status === 'DELIVERED').length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-2xl font-bold text-info">
            {Math.round((notifications.filter(n => n.status === 'DELIVERED').length / notifications.length) * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationGrid;
