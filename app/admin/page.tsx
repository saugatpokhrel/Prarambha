import AdminPanelClient from "./AdminPanelClient";

export default function AdminPage() {
  const authorizedAdmins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase());

  return <AdminPanelClient authorizedAdmins={authorizedAdmins} />;
}
