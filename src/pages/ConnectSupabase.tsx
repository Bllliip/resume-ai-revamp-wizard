import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const STORAGE_URL_KEY = "SUPABASE_URL";
const STORAGE_ANON_KEY = "SUPABASE_ANON_KEY";

export default function ConnectSupabase() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [anon, setAnon] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = "Connect Supabase - Manual Setup";
    const existingUrl = localStorage.getItem(STORAGE_URL_KEY) || "";
    const existingAnon = localStorage.getItem(STORAGE_ANON_KEY) || "";
    setUrl(existingUrl);
    setAnon(existingAnon);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !anon) {
      toast({ title: "Missing values", description: "Please enter both URL and anon key." });
      return;
    }
    if (!/^https?:\/\//.test(url)) {
      toast({ title: "Invalid URL", description: "Supabase URL must start with http(s)://" });
      return;
    }
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_URL_KEY, url.trim());
      localStorage.setItem(STORAGE_ANON_KEY, anon.trim());
      toast({ title: "Saved", description: "Reloading to apply your Supabase connection..." });
      setTimeout(() => {
        // Reload so the shared client picks up the new values
        window.location.href = "/auth";
        window.location.reload();
      }, 600);
    } catch (err) {
      console.error(err);
      toast({ title: "Save failed", description: "Could not store values in your browser." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Connect Supabase</CardTitle>
          <CardDescription>Paste your Supabase URL and anon key to connect manually.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Supabase URL</Label>
              <Input id="url" placeholder="https://YOUR-PROJECT.supabase.co" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anon">Supabase anon key</Label>
              <Input id="anon" placeholder="eyJhbGciOi..." value={anon} onChange={(e) => setAnon(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save & Reload"}</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
