"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toast } from "@/components/Toast";
import WelcomeDialog from "@/components/WelcomeDialog";

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

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      const res = await fetch("/api/link", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId: id }),
      });
      if (res.ok) {
        setLinks(links => links.filter(l => l.id !== id));
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-xl mx-auto bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl p-10 flex flex-col items-center gap-8 border border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black dark:text-white mb-2">Shorten your links</h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-2">Paste your long URL below and get a short, shareable link instantly.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 items-center">
          <input
            type="url"
            placeholder="Paste your long URL here..."
            className="input input-bordered w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-base"
            value={url}
            onChange={e => setUrl(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="input input-bordered w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-base"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            placeholder="Expiration (optional)"
          />
          <button type="submit" className="btn btn-primary w-full py-3 rounded-lg font-semibold text-lg bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition" disabled={loading}>
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white dark:text-black mx-auto" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            ) : "Shorten"}
          </button>
        </form>
        <div className="text-xs text-zinc-400 mt-2">Expiration is optional. Leave blank for a permanent link.</div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        {shortLink && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 flex flex-col items-center gap-2 w-full">
            <span className="font-mono text-lg bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-lg w-full text-center">{shortLink}</span>
            <button className="btn btn-secondary w-full py-2 rounded-lg font-semibold text-base bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 transition" onClick={() => shortLink && navigator.clipboard.writeText(shortLink)}>{copied ? "Copied!" : "Copy"}</button>
          </motion.div>
        )}
      </motion.div>
      <div className="w-full max-w-3xl mx-auto mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Your Links Timeline</h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search links..."
              className="input input-bordered px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              className="btn btn-secondary px-3 py-2 rounded-lg text-sm font-semibold bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 transition"
              onClick={() => setSortDesc(s => !s)}
            >
              {sortDesc ? "Newest" : "Oldest"}
            </button>
          </div>
        </div>
        <div className="bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800 p-6">
          {tableLoading ? (
            <div className="flex justify-center items-center min-h-[120px]">
              <svg className="animate-spin h-6 w-6 text-black dark:text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            </div>
          ) : filteredLinks.length === 0 ? (
            <p className="text-center text-zinc-500">No links yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="py-2 px-2 font-semibold">Short URL</th>
                  <th className="py-2 px-2 font-semibold">Original URL</th>
                  <th className="py-2 px-2 font-semibold">Created</th>
                  <th className="py-2 px-2 font-semibold">Expires</th>
                  <th className="py-2 px-2 font-semibold">Clicks</th>
                  <th className="py-2 px-2 font-semibold">Status</th>
                  <th className="py-2 px-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLinks.map(link => (
                  <tr key={link.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                    <td className="py-2 px-2 font-mono text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => handleCopy(link)}>{`${window.location.origin}/${link.shortCode}`}</td>
                    <td className="py-2 px-2 truncate max-w-[180px] text-zinc-700 dark:text-zinc-300">{link.originalUrl}</td>
                    <td className="py-2 px-2 text-zinc-500 text-xs">{new Date(link.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-2 text-zinc-500 text-xs">{link.expiresAt ? new Date(link.expiresAt).toLocaleString() : "-"}</td>
                    <td className="py-2 px-2 text-zinc-500 text-xs">{link.clicks}</td>
                    <td className="py-2 px-2 text-xs">
                      {link.expired ? <span className="text-red-500 font-semibold">Expired</span> : <span className="text-green-600 font-semibold">Active</span>}
                    </td>
                    <td className="py-2 px-2 flex gap-2 flex-wrap">
                      <button className="btn btn-secondary px-3 py-1 rounded-lg text-xs bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white hover:bg-zinc-300 dark:hover:bg-zinc-600 transition" onClick={() => handleCopy(link)}>
                        Copy
                      </button>
                      <button className="btn btn-primary px-3 py-1 rounded-lg text-xs bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition" onClick={() => handleShowQR(link)}>
                        QR
                      </button>
                      <button className="btn btn-destructive px-3 py-1 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600 transition" onClick={() => handleDelete(link.id)} disabled={deleting === link.id}>
                        {deleting === link.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Toast message={toast.message} open={toast.open} onOpenChange={open => setToast(t => ({ ...t, open }))} />
      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} qr={qr} />
    </div>
  );
} 