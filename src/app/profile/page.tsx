"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  // Mock user data for demo; replace with real user fetch in production
  const [user, setUser] = useState({ email: "user@example.com" });
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [modal, setModal] = useState<{ open: boolean; type: "success" | "error" | "confirm"; message: string }>({ open: false, type: "success", message: "" });
  const [loading, setLoading] = useState(false);

  // Generate a random avatar URL (DiceBear)
  const avatarUrl = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(user.email)}`;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setModal({ open: true, type: "success", message: "Profile updated successfully!" });
      setUser({ ...user, email });
    }, 1000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (password.length < 6) {
        setModal({ open: true, type: "error", message: "Password must be at least 6 characters." });
      } else {
        setModal({ open: true, type: "success", message: "Password changed successfully!" });
        setPassword("");
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full">
      <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-2xl border-0">
        <CardHeader>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 p-1 mb-2">
              <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full bg-white dark:bg-zinc-900 object-cover" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">Your Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full" />
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white dark:text-black font-semibold text-lg py-3 mt-2" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
          <form className="flex flex-col gap-4 mt-8" onSubmit={handlePasswordChange}>
            <label className="text-zinc-700 dark:text-zinc-300 font-semibold">Change Password</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="New password" className="w-full" />
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white dark:text-black font-semibold text-lg py-3 mt-2" disabled={loading}>
              {loading ? "Saving..." : "Change Password"}
            </Button>
          </form>
          <Button variant="destructive" className="w-full mt-8" onClick={() => setModal({ open: true, type: "confirm", message: "Are you sure you want to log out?" })}>Log Out</Button>
        </CardContent>
      </Card>
      <Dialog open={modal.open} onOpenChange={open => setModal(m => ({ ...m, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modal.type === "success" && "Success"}
              {modal.type === "error" && "Error"}
              {modal.type === "confirm" && "Confirm"}
            </DialogTitle>
            <DialogDescription>{modal.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {modal.type === "confirm" ? (
              <div className="flex gap-2 w-full">
                <Button variant="destructive" className="w-full" onClick={() => { setModal({ ...modal, open: false }); signOut(); }}>Yes, Log Out</Button>
                <Button variant="secondary" className="w-full" onClick={() => setModal({ ...modal, open: false })}>Cancel</Button>
              </div>
            ) : (
              <Button className="w-full" onClick={() => setModal({ ...modal, open: false })}>OK</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 