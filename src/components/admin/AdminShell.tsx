import { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useAdminSession } from "@/hooks/useAdminSession";

/**
 * Wrapper for every /admin route. The guard here is a convenience only —
 * the compliance data itself is protected server-side, where each request is
 * re-authenticated and the role re-checked before any row is read.
 */
const AdminShell = ({ children, title }: { children: ReactNode; title: string }) => {
  const { loading, userId, email, roles, signOut } = useAdminSession();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!userId) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title} | BrightCap</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-6">
            <Link to="/admin/investors" className="text-sm tracking-tight font-medium">
              brightcap <span className="text-muted-foreground">compliance</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {email}
              {roles.length > 0 && ` · ${roles.join(", ")}`}
            </span>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {roles.length === 0 ? (
        <main className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-2xl mb-4">No access</h1>
          <p className="text-sm text-muted-foreground">
            This account is signed in but has not been granted a compliance role. Ask an
            administrator to grant access.
          </p>
        </main>
      ) : (
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>
      )}
    </div>
  );
};

export default AdminShell;
