import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  PhoneOutlined,
  UserOutlined,
  HeartFilled,
  LogoutOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  AppstoreOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { Dropdown, Button, type MenuProps } from "antd";

const BG = "#f9fafb";
const SIDEBAR_WIDTH = 200;
const HEADER_HEIGHT = 44;

interface TokenData {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Usuario");
  const [userRole, setUserRole] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>("Leads");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previousPath, setPreviousPath] = useState<string>("");

  // Detectar si estamos en una ruta de detalle (oportunidades/:id)
  const isDetailRoute = location.pathname.match(/^\/leads\/oportunidad(es)?\/\d+$/);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded: TokenData = jwtDecode(token);
        setUserName(
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
          ] || "Usuario"
        );
        setUserRole(
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || ""
        );
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    }
  }, []);

  // Colapsar sidebar automáticamente solo cuando ENTRAMOS a una ruta de detalle
  useEffect(() => {
    // Solo colapsar si cambiamos de una ruta normal a una ruta de detalle
    const wasDetailRoute = previousPath.match(/^\/leads\/oportunidad(es)?\/\d+$/);

    if (isDetailRoute && !wasDetailRoute) {
      setIsSidebarCollapsed(true);
    }

    setPreviousPath(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItemStyle = (active: boolean) => ({
    fontSize: 13,
    padding: "6px 12px",
    borderRadius: 8,
    background: active ? "#e8f0ff" : "transparent",
    color: active ? "#1677ff" : "#1f2937",
    cursor: "pointer",
    fontWeight: active ? 600 : 500,
    display: "flex",
    alignItems: "center",
    gap: 6,
    transition: "all 0.2s ease",
  });

  const userMenuItems: MenuProps["items"] = [
    {
      key: "info",
      label: (
        <div style={{ padding: "6px 8px" }}>
          <div style={{ fontWeight: 600 }}>{userName}</div>
          <div style={{ fontSize: 13, color: "#666" }}>{userRole}</div>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <div
          onClick={handleLogout}
          style={{
            color: "red",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <LogoutOutlined /> Cerrar sesión
        </div>
      ),
    },
  ];

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: BG,
      }}
    >
      {/* === SIDEBAR === */}
      <aside
        style={{
          width: isSidebarCollapsed ? 0 : SIDEBAR_WIDTH,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          padding: isSidebarCollapsed ? 0 : 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
          overflow: "hidden",
        }}
      >
        {!isSidebarCollapsed && (
          <>
            {/* === LOGO === */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <img
                src="/logo.png"
                alt="Olympus"
                style={{ width: 50, marginBottom: 6 }}
              />
              <div style={{ fontWeight: 600, fontSize: 15 }}>Olympus</div>
            </div>

            {/* === MENÚ PRINCIPAL === */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {/* SECCIÓN: LEADS */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  padding: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#1f2937",
                    padding: "5px 6px",
                  }}
                  onClick={() => toggleMenu("Leads")}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <PhoneOutlined /> Leads
                  </span>
                  {openMenu === "Leads" ? (
                    <CaretUpOutlined />
                  ) : (
                    <CaretDownOutlined />
                  )}
                </div>
                {openMenu === "Leads" && (
                  <div
                    style={{
                      paddingLeft: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <div
                      style={menuItemStyle(isActive("/leads/Opportunities") || isActive("/leads/SalesProcess"))}
                      onClick={() => navigate("/leads/SalesProcess")}
                    >
                      <AppstoreOutlined /> Oportunidades
                    </div>
                    {userRole !== "Asesor" && (
                      <div
                        style={menuItemStyle(isActive("/leads/asignacion"))}
                        onClick={() => navigate("/leads/asignacion")}
                      >
                        <DashboardOutlined /> Asignación
                      </div>
                    )}

                    <div
                      style={menuItemStyle(isActive("/leads/dashboard"))}
                      onClick={() => navigate("/leads/dashboard")}
                    >
                      <DashboardOutlined /> Dashboard
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN: USUARIOS */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  padding: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#1f2937",
                    padding: "5px 6px",
                  }}
                  onClick={() => toggleMenu("Usuarios")}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <UserOutlined /> Usuarios
                  </span>
                  {openMenu === "Usuarios" ? (
                    <CaretUpOutlined />
                  ) : (
                    <CaretDownOutlined />
                  )}
                </div>

                {openMenu === "Usuarios" && (
                  <div
                    style={{
                      paddingLeft: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {userRole !== "Asesor" && (
                      <div
                        style={menuItemStyle(isActive("/usuarios/usuarios"))}
                        onClick={() => navigate("/usuarios/usuarios")}
                      >
                        <DashboardOutlined /> Mantenimiento
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECCIÓN: BIENESTAR ACADÉMICO */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  padding: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#1f2937",
                    padding: "5px 6px",
                  }}
                  onClick={() => toggleMenu("Bienestar")}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <HeartFilled /> Bienestar académico
                  </span>
                  {openMenu === "Bienestar" ? (
                    <CaretUpOutlined />
                  ) : (
                    <CaretDownOutlined />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </aside>

      {/* === MAIN CONTENT === */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: 8,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            height: HEADER_HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <Button
            type="text"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            icon={
              isSidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
          />

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                cursor: "pointer",
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#1677ff",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserOutlined />
            </div>
          </Dropdown>
        </div>

        {/* CONTENIDO */}
        <div style={{ flex: 1, overflow: "auto", marginTop: 8 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
