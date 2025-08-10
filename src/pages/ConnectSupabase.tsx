import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const ConnectSupabase = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [anon, setAnon] = useState("");

  useEffect(() => {
    const existingUrl = localStorage.getItem("SUPABASE_URL") || "";
    const existingAnon = localStorage.getItem("SUPABASE_ANON_KEY") || "";
    setUrl(existingUrl);
    setAnon(existingAnon);
  }, []);

  const save = () => {
    if (!url || !anon) {
      toast({
        title: "Missing values",
        description: "Please enter both the Supabase URL and Anon Key.",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("SUPABASE_URL", url.trim());
    localStorage.setItem("SUPABASE_ANON_KEY", anon.trim());
    toast({ title: "Saved", description: "Supabase connection saved. Reloading..." });
    setTimeout(() => window.location.reload(), 600);
  };

  const clear = () => {
    localStorage.removeItem("SUPABASE_URL");
    localStorage.removeItem("SUPABASE_ANON_KEY");
    toast({ title: "Cleared", description: "Supabase connection removed." });
    setUrl("");
    setAnon("");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle>Connect Supabase</CardTitle>
          <CardDescription>
            Enter your Supabase Project URL and Anon (public) key. These are stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="supabase-url">Supabase Project URL</Label>
            <Input
              id="supabase-url"
              placeholder="https://YOUR-PROJECT-ref.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="supabase-anon">Supabase Anon Key</Label>
            <Input
              id="supabase-anon"
              placeholder="paste your anon key"
              value={anon}
              onChange={(e) => setAnon(e.target.value)}
            />
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Button onClick={save}>Save & Reload</Button>
            <Button variant="secondary" onClick={clear}>Clear</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ConnectSupabase;
