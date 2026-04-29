import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminPage } from "./pages/AdminPage";
import { AdminBrowserPage } from "./pages/AdminBrowserPage";
import { AdminLogsPage } from "./pages/AdminLogsPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { ApiCenterPage } from "./pages/ApiCenterPage";
import { ClientPage } from "./pages/ClientPage";
import { ClientDocsPage } from "./pages/ClientDocsPage";
import { ClientKeysPage } from "./pages/ClientKeysPage";
import { ClientUsagePage } from "./pages/ClientUsagePage";
import { ExplorerPage } from "./pages/ExplorerPage";
import { LoginPage } from "./pages/LoginPage";
import { OverviewPage } from "./pages/OverviewPage";
import { RequirementsPage } from "./pages/RequirementsPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/api-center" element={<ApiCenterPage />} />
          <Route path="/requirements" element={<RequirementsPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/browser"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminBrowserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client"
            element={
              <ProtectedRoute allowedRoles={["admin", "client"]}>
                <ClientPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/usage"
            element={
              <ProtectedRoute allowedRoles={["admin", "client"]}>
                <ClientUsagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/keys"
            element={
              <ProtectedRoute allowedRoles={["admin", "client"]}>
                <ClientKeysPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/docs"
            element={
              <ProtectedRoute allowedRoles={["admin", "client"]}>
                <ClientDocsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/explorer" element={<ExplorerPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
