

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover"
import { Badge } from "@/core/components/ui/badge"

export function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New submission",
      message: "Alex Johnson submitted evidence for Zero Waste Week",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Reward distribution due",
      message: "Zero Waste Week rewards need to be distributed by tomorrow",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title: "Challenge ending soon",
      message: "Plastic-Free Challenge ends in 2 days",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 4,
      title: "New project proposal",
      message: "Community member submitted a new project proposal",
      time: "Yesterday",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-emerald-600">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications</div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 ${notification.read ? "" : "bg-muted/50"}`}>
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
