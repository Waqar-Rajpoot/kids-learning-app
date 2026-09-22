import { motion } from "framer-motion";
import { Clock, Sparkle } from "lucide-react";
import { useRecentActivity } from "@/hooks/useRecentActivity";

function timeAgo(date: Date | null): string {
  if (!date) return "just now";
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const RecentActivityCard = () => {
  const { activities, loading } = useRecentActivity();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-6 shadow-2xl"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="font-black uppercase italic text-sm tracking-wider text-white">
          Recent Activities
        </h3>
      </div>

      {loading ? (
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Loading...</p>
      ) : activities.length === 0 ? (
        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
          Nothing yet today — go play something!
        </p>
      ) : (
        <ul className="space-y-2">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex items-center justify-between bg-black/30 rounded-2xl px-4 py-3 border border-white/5"
            >
              <div className="flex items-center gap-3">
                <Sparkle className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-bold text-white/80">{activity.label}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {activity.points > 0 && (
                  <span className="text-orange-400 text-xs font-black">+{activity.points} XP</span>
                )}
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                  {timeAgo(activity.timestamp)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};

export default RecentActivityCard;
