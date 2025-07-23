"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toast } from "@/components/Toast";
import WelcomeDialog from "@/components/WelcomeDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog";

function QRModal({ open, onClose, qr }: { open: boolean; onClose: () => void; qr: string | null }) {
  if (!open || !qr) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center border border-zinc-100 dark:border-zinc-800">
        <img src={qr} alt="QR Code" className="w-48 h-48" />
        <button className="btn btn-primary mt-6 w-full py-2 rounded-lg font-semibold text-base bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function ShortenerClient({ userEmail }: { userEmail: string }) {
  const [url, setUrl] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [shortLink, setShortLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: "" });
  const [links, setLinks] = useState<any[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; linkId: string | null }>({ open: false, linkId: null });

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setTableLoading(true);
    try {
      const res = await fetch("/api/link");
      const data = await res.json();
      setLinks(data.links || []);
    } finally {
      setTableLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortLink(null);
    try {
      const res = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url, expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined }),
      });
      const data = await res.json();
      if (data.link) {
        setShortLink(`${window.location.origin}/${data.link.shortCode}`);
        setExpiresAt("");
        fetchLinks();
        setToast({ open: true, message: "Link created!" });
      } else {
        setError(data.error || "Failed to shorten link");
      }
    } catch {
      setError("Failed to shorten link");
    }
    setLoading(false);
  }

  async function handleCopy(link: any) {
    await navigator.clipboard.writeText(`${window.location.origin}/${link.shortCode}`);
    setCopied(true);
    setToast({ open: true, message: "Link copied!" });
    setTimeout(() => setCopied(false), 1200);
  }

  async function handleDeleteConfirmed() {
    if (!confirmDelete.linkId) return;
    setDeleting(confirmDelete.linkId);
    setConfirmDelete({ open: false, linkId: null });
    try {
      const res = await fetch("/api/link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: confirmDelete.linkId }),
      });
      if (res.ok) {
        setLinks(links => links.filter(l => l.id !== confirmDelete.linkId));
        setToast({ open: true, message: "Link deleted!" });
      } else {
        const data = await res.json().catch(() => ({}));
        setToast({ open: true, message: data.error || "Failed to delete link" });
      }
    } catch (e) {
      setToast({ open: true, message: "Network error: Failed to delete link" });
    } finally {
      setDeleting(null);
    }
  }

  async function handleShowQR(link: any) {
    const short = `${window.location.origin}/${link.shortCode}`;
    const res = await fetch(`/api/qr?url=${encodeURIComponent(short)}`);
    const data = await res.json();
    setQr(data.qr);
    setQrOpen(true);
  }

  // Filtering and sorting
  const filteredLinks = links
    .filter(link =>
      link.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
      link.shortCode.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortDesc
      ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 w-full">
      <WelcomeDialog />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-xl mx-auto">
        <Card className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-2xl border-0">
          <CardHeader>
            <CardTitle className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent text-center">Shorten your links</CardTitle>
            <p className="text-lg text-zinc-600 dark:text-zinc-300 text-center mt-2">Paste your long URL below and get a short, shareable link instantly.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 items-center">
              <Input
                type="url"
                placeholder="Paste your long URL here..."
                className="w-full"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
              />
              <Input
                type="datetime-local"
                className="w-full"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                placeholder="Expiration (optional)"
              />
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white dark:text-black font-semibold text-lg py-3" disabled={loading}>
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                ) : "Shorten"}
              </Button>
            </form>
            <div className="text-xs text-zinc-400 mt-2 text-center">Expiration is optional. Leave blank for a permanent link.</div>
            {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
            {shortLink && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex flex-col items-center gap-2 w-full">
                <span className="font-mono text-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg w-full text-center">{shortLink}</span>
                <Button variant="secondary" className="w-full" onClick={() => shortLink && navigator.clipboard.writeText(shortLink)}>{copied ? "Copied!" : "Copy"}</Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <div className="w-full max-w-3xl mx-auto mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">Your Links Timeline</h2>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Search links..."
              className="px-3 py-2 rounded-lg text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button variant="secondary" className="px-3 py-2 text-sm font-semibold" onClick={() => setSortDesc(s => !s)}>
              {sortDesc ? "Newest" : "Oldest"}
            </Button>
          </div>
        </div>
        <Card className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-xl border-0">
          <CardContent className="p-0">
            {tableLoading ? (
              <div className="flex justify-center items-center min-h-[120px]">
                <svg className="animate-spin h-6 w-6 text-black dark:text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              </div>
            ) : filteredLinks.length === 0 ? (
              <p className="text-center text-zinc-500">No links yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Short URL</TableHead>
                    <TableHead>Original URL</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map(link => (
                    <TableRow key={link.id} className="hover:bg-blue-50 dark:hover:bg-zinc-800 transition">
                      <TableCell className="font-mono text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => handleCopy(link)}>{`${window.location.origin}/${link.shortCode}`}</TableCell>
                      <TableCell className="truncate max-w-[180px] text-zinc-700 dark:text-zinc-300">{link.originalUrl}</TableCell>
                      <TableCell className="text-zinc-500 text-xs">{new Date(link.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="text-zinc-500 text-xs">{link.expiresAt ? new Date(link.expiresAt).toLocaleString() : "-"}</TableCell>
                      <TableCell className="text-zinc-500 text-xs">{link.clicks}</TableCell>
                      <TableCell className="text-xs">
                        {link.expired ? <span className="text-red-500 font-semibold">Expired</span> : <span className="text-green-600 font-semibold">Active</span>}
                      </TableCell>
                      <TableCell className="flex gap-2 flex-wrap">
                        <Button variant="secondary" size="sm" onClick={() => handleCopy(link)}>
                          Copy
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleShowQR(link)}>
                          QR
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setConfirmDelete({ open: true, linkId: link.id })} disabled={deleting === link.id}>
                          {deleting === link.id ? "Deleting..." : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Toast message={toast.message} open={toast.open} onOpenChange={open => setToast(t => ({ ...t, open }))} />
      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} qr={qr} />
      <AlertDialog open={confirmDelete.open} onOpenChange={open => setConfirmDelete(c => ({ ...c, open }))}>
        <AlertDialogContent className="bg-gradient-to-br from-red-100 via-pink-100 to-purple-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="bg-gradient-to-r from-red-600 via-pink-500 to-purple-500 bg-clip-text text-transparent text-2xl font-bold text-center">Delete Link?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">Are you sure you want to delete this link? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 justify-center">
            <AlertDialogCancel asChild>
              <Button variant="secondary" className="w-full">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" className="w-full" onClick={handleDeleteConfirmed}>Delete</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 