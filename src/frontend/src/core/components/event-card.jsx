"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/badge";

export default function EventCard({ event, categoryMap }) {
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const category = categoryMap[event.category];

  return (
    <motion.div
      className="bg-beige-900 border-2 border-beige-700 rounded-lg overflow-hidden"
      whileHover={{
        boxShadow: "0 0 15px rgba(236,234,227,0.2)",
        y: -5,
      }}
    >
      {/* Event image with category badge */}
      <div className="relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8d856633_1px,transparent_1px),linear-gradient(to_bottom,#8d856633_1px,transparent_1px)] bg-[size:8px_8px] z-10 opacity-40"></div>
        <img src={event.image || "/placeholder.svg"} alt={event.title} width={400} height={200} className="w-full h-48 object-cover" />
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start z-20">
          <Badge className={`${category.color} text-white px-3 py-1 flex items-center gap-1`}>
            {category.icon} {category.label}
          </Badge>
          <Badge className="bg-beige-800 text-beige-200 border border-beige-600 px-3 py-1 flex items-center gap-1">
            <Users className="h-3 w-3" /> {event.participants}
          </Badge>
        </div>

        {/* Retro terminal effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-beige-900 to-transparent z-10"></div>
        <div className="absolute bottom-0 left-0 w-full p-2 z-20">
          <div className="flex items-center gap-1 text-xs text-beige-300">
            <span className="text-green-400">ID:</span> ECO-{event.id.toString().padStart(4, "0")}
          </div>
        </div>
      </div>

      {/* Event details */}
      <div className="p-4">
        <h3 className="text-beige-200 font-bold text-lg mb-2 line-clamp-1">{event.title}</h3>

        <p className="text-beige-400 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-green-400" />
            <span className="text-beige-300">
              {formatDate(event.date)} | {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-green-400" />
            <span className="text-beige-300">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-green-400" />
            <span className="text-beige-300">{event.rewards}</span>
          </div>
        </div>

        {/* Participate button with retro effect */}
        <a href={`/events/${event.id}/participate`}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button className="w-full bg-beige-800 hover:bg-beige-700 text-beige-200 border border-beige-600 group">
              <span className="mr-1 text-green-400">&gt;</span>
              PARTICIPATE
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </a>
      </div>

      {/* Pixelated border effect */}
      <div className="h-1 w-full bg-[linear-gradient(to_right,#8d8566_4px,transparent_4px,transparent_8px)] bg-[size:8px_1px]"></div>
    </motion.div>
  );
}
