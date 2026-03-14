import { 
  getAuth, 
  sendEmailVerification, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { toast } from "sonner";

const auth = getAuth();

const actionCodeSettings = {
  url: 'https://kids-academy.web.app/login',
  handleCodeInApp: true,
};

// 1. Trigger Verification Email
export const verifyEmail = async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      await sendEmailVerification(user, actionCodeSettings);
      toast.success("Verification signal sent to your inbox!");
    } catch (error) {
      toast.error("Signal failed: " + error.message);
    }
  }
};

// 2. Trigger Password Reset Email
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    toast.success("Reset coordinates sent to your email!");
  } catch (error) {
    toast.error("Error: " + error.message);
  }
};