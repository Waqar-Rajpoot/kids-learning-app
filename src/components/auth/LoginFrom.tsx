import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Lock, Rocket, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/auth.service";

// Firebase Imports for Database Role Check
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

 // Inside your onSubmit function in LoginForm.tsx
async function onSubmit(values: z.infer<typeof formSchema>) {
  setIsLoading(true);
  try {
    const user = await AuthService.login(values.email, values.password);
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    toast.success("Welcome back, Explorer!");

    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // STRICT REDIRECTION
      if (userData.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error(error.message || "Invalid email or password.");
  } finally {
    setIsLoading(false);
  }
}
  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 relative overflow-hidden font-display">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10" 
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 sm:p-12 shadow-2xl">
          {/* Brand/Header Section */}
          <div className="text-center space-y-4 mb-10">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 text-primary mb-2 shadow-xl"
            >
              <Rocket className="w-8 h-8" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Welcome <span className="text-primary font-black">Back!</span>
            </h1>
            <p className="text-white/40 text-sm font-medium max-w-[250px] mx-auto">
              Ready to continue your magical learning quest?
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-white/50 text-[10px] font-black uppercase tracking-[0.25em] ml-1">Parent's Email</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="parent@example.com" 
                          className="pl-14 h-16 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/40 focus:border-primary transition-all text-white placeholder:text-white/10 text-lg shadow-inner" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <FormLabel className="text-white/50 text-[10px] font-black uppercase tracking-[0.25em]">Security Key</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative group">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••" 
                          className="pl-14 pr-12 h-16 bg-white/5 border-white/10 rounded-2xl focus:ring-primary/40 focus:border-primary transition-all text-white placeholder:text-white/10 text-lg shadow-inner" 
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />

              <Button 
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-primary/30 active:scale-[0.97] transition-all group overflow-hidden" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign Into Adventure
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          {/* Decorative Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em]">
              <span className="bg-[#11192e] px-6 text-white/20 font-bold">New Here?</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-center text-sm text-white/40 font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-black hover:text-primary/80 transition-colors">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}