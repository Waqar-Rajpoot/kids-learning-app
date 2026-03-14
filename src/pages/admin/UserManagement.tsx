import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ShieldCheck,
  UserCog,
  Ban,
  CheckCircle,
  Trash2,
  Users,
  Search,
  Activity,
  Target,
  Mail,
  Fingerprint,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserData {
  id: string;
  displayName?: string;
  email?: string;
  role: string;
  isBlocked: boolean;
  score: number;
  rank: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
      const usersList = snap.docs.map(
        (d) =>
          ({
            id: d.id,
            ...d.data(),
          }) as UserData,
      );
      setUsers(usersList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    await updateDoc(doc(db, "users", userId), {
      role: currentRole === "admin" ? "user" : "admin",
    });
  };

  const toggleBlockStatus = async (userId: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "users", userId), { isBlocked: !currentStatus });
  };

  const confirmDelete = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading)
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-emerald-500">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Activity className="w-12 h-12" />
        </motion.div>
        <p className="font-black uppercase tracking-[0.3em] text-[10px]">
          Scanning User Database...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-emerald-500/30 pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 space-y-8">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <UserCog className="text-emerald-500 w-6 h-6" />
              </div>
              <h1 className="text-2xl md:text-3xl text-white/80 font-black uppercase italic tracking-tight">
                Personnel Control
              </h1>
            </div>
            <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold px-1">
              Authorized Admin Access • System v4.0
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="SEARCH OPERATOR..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {[
            {
              label: "Total Units",
              val: users.length,
              icon: Users,
              color: "text-blue-400",
              bg: "bg-blue-400/10",
            },
            {
              label: "Admins",
              val: users.filter((u) => u.role === "admin").length,
              icon: ShieldCheck,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10",
            },
            {
              label: "Blocked",
              val: users.filter((u) => u.isBlocked).length,
              icon: Ban,
              color: "text-red-400",
              bg: "bg-red-400/10",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-white/5 border border-white/10 p-5 md:p-6 rounded-[2rem] flex flex-col gap-3 backdrop-blur-md ${
                i === 2 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              {/* Top Row: Label and Icon side-by-side */}
              <div className="flex items-center justify-between w-full">
                <p className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">
                  {stat.label}
                </p>
                <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                  <stat.icon
                    className={`${stat.color} w-3.5 h-3.5 md:w-4 md:h-4`}
                  />
                </div>
              </div>

              {/* Next Row: Value */}
              <div>
                <p className="text-2xl md:text-3xl font-black italic tracking-tighter text-white/90">
                  {stat.val}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  <th className="px-8 py-6">Operator Identity</th>
                  <th className="px-8 py-6">Clearance & Ranking</th>
                  <th className="px-8 py-6 text-right">Commands</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user, idx) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      idx={idx}
                      toggleRole={toggleRole}
                      toggleBlock={toggleBlockStatus}
                      onDelete={confirmDelete}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user, idx) => (
                <UserCard
                  key={user.id}
                  user={user}
                  idx={idx}
                  toggleRole={toggleRole}
                  toggleBlock={toggleBlockStatus}
                  onDelete={confirmDelete}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-20 text-center space-y-4">
              <Fingerprint className="w-12 h-12 text-white/10 mx-auto" />
              <p className="text-white/20 uppercase font-black text-xs tracking-widest">
                No matching records found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const UserRow = ({ user, idx, toggleRole, toggleBlock, onDelete }) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.05 }}
    className="hover:bg-white/[0.02] transition-colors"
  >
    <td className="px-8 py-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shrink-0">
          <span className="text-xs font-black uppercase">
            {user.displayName?.charAt(0) || "?"}
          </span>
        </div>
        <div className="min-w-0">
          <div className="font-black uppercase italic tracking-tight flex items-center gap-2 text-white/80 truncate">
            {user.displayName || "Unknown Unit"}
            {user.isBlocked && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            )}
          </div>
          <div className="text-[10px] font-mono text-white/30 lowercase truncate">
            {user.email}
          </div>
        </div>
      </div>
    </td>
    <td className="px-8 py-6">
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
            user.role === "admin"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-white/5 border-white/10 text-white/40"
          }`}
        >
          {user.role}
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
          <Target className="w-3 h-3 text-blue-400" />
          <span className="text-[9px] font-black uppercase text-blue-400">
            {user.rank || "ROOKIE"}
          </span>
        </div>
      </div>
    </td>
    <td className="px-8 py-6 text-right">
      <div className="flex items-center justify-end gap-2">
        <ActionButton
          onClick={() => toggleRole(user.id, user.role)}
          icon={ShieldCheck}
          active={user.role === "admin"}
          color="hover:text-emerald-400"
        />
        <ActionButton
          onClick={() => toggleBlock(user.id, !!user.isBlocked)}
          icon={user.isBlocked ? CheckCircle : Ban}
          active={user.isBlocked}
          color="hover:text-orange-400"
        />
        <DeleteAction user={user} onDelete={onDelete} />
      </div>
    </td>
  </motion.tr>
);

const UserCard = ({ user, idx, toggleRole, toggleBlock, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.05 }}
    className="p-6 space-y-5"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-lg font-black uppercase text-emerald-500">
            {user.displayName?.charAt(0) || "?"}
          </span>
        </div>
        <div>
          <h3 className="font-black uppercase italic text-white/90 leading-tight">
            {user.displayName}
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-white/40 font-mono mt-1">
            <Mail size={10} /> {user.email}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${user.role === "admin" ? "bg-emerald-500 text-black" : "bg-white/10 text-white/40"}`}
        >
          {user.role}
        </span>
        {user.isBlocked && (
          <span className="text-[8px] font-black uppercase text-red-500 animate-pulse">
            Blocked
          </span>
        )}
      </div>
    </div>

    <div className="flex items-center justify-between gap-4 pt-2">
      <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
        <Target size={14} className="text-blue-400" />
        <span className="text-[10px] font-black uppercase text-blue-400">
          {user.rank || "ROOKIE"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ActionButton
          onClick={() => toggleRole(user.id, user.role)}
          icon={ShieldCheck}
          active={user.role === "admin"}
          color="hover:text-emerald-400"
        />
        <ActionButton
          onClick={() => toggleBlock(user.id, !!user.isBlocked)}
          icon={user.isBlocked ? CheckCircle : Ban}
          active={user.isBlocked}
          color="hover:text-orange-400"
        />
        <DeleteAction user={user} onDelete={onDelete} />
      </div>
    </div>
  </motion.div>
);

// Unified Action Button
const ActionButton = ({ onClick, icon: Icon, active = false, color }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-2xl border transition-all active:scale-95
      ${
        active
          ? "bg-white/10 border-white/20 text-white"
          : `bg-white/5 border-white/5 text-white/20 ${color} hover:bg-white/10`
      }`}
  >
    <Icon size={18} />
  </button>
);

// Shadcn Alert Dialog for Deletion
const DeleteAction = ({
  user,
  onDelete,
}: {
  user: UserData;
  onDelete: (id: string) => void;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="p-3 bg-white/5 border border-white/5 text-white/20 hover:text-red-500 hover:bg-white/10 rounded-2xl transition-all active:scale-95">
        <Trash2 size={18} />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="bg-[#020617] border border-white/10 rounded-3xl backdrop-blur-xl">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-white font-black uppercase italic tracking-tighter text-xl">
          Terminate Personnel Record?
        </AlertDialogTitle>
        <AlertDialogDescription className="text-white/50 text-xs uppercase tracking-widest font-bold">
          This action will permanently purge{" "}
          <span className="text-white underline">{user.email}</span> from the
          central database. This cannot be reversed.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="mt-4 gap-3">
        <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl uppercase text-[10px] font-black">
          Abort
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={() => onDelete(user.id)}
          className="bg-red-500 hover:bg-red-600 text-white rounded-xl uppercase text-[10px] font-black"
        >
          Confirm Purge
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
