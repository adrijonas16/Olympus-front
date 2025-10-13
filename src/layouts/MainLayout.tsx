import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Dropdown, type MenuProps } from "antd";
import {
  PhoneOutlined,
  UserOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const BG = "#f1f5f9"; // gris claro
const BG_GRAY = "#e2e8f0"; // gris medio
const SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 44;

interface TokenData {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("Usuario");
  const [userRole, setUserRole] = useState<string>("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // ✅ LECTURA DEL TOKEN DESDE COOKIES
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

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navButtonStyle = (active: boolean) => ({
    width: "100%",
    borderRadius: 8,
    fontWeight: 500,
    color: active ? "#fff" : "#2c3e50",
    backgroundColor: active ? "#1677ff" : "#fff",
    border: active ? "1px solid #1677ff" : "1px solid #d9d9d9",
    transition: "all 0.2s ease",
    marginBottom: 8,
    height: 36,
  });

  const userMenuItems: MenuProps["items"] = [
    {
      key: "user-info",
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
          style={{ color: "red", display: "flex", alignItems: "center", gap: 8 }}
        >
          <LogoutOutlined /> Cerrar sesión
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: BG,
        overflow: "hidden",
      }}
    >
      {/* ===== SIDEBAR ===== */}
      <aside
        style={{
          width: isSidebarCollapsed ? 0 : SIDEBAR_WIDTH,
          transition: "width 0.3s ease",
          overflow: "hidden",
          background: BG,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: isSidebarCollapsed ? 0 : 8,
          boxSizing: "border-box",
        }}
      >
        {!isSidebarCollapsed && (
          <>
            {/* ===== CARD PRINCIPAL ===== */}
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 8,
                height: "100%",
                boxShadow: "0 2px 8px rgba(44,62,80,0.08)",
                boxSizing: "border-box",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* CONTENIDO SUPERIOR (logo + secciones) */}
              <div style={{ flex: 1 }}>
                {/* LOGO */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <img
                    src="/logo.png"
                    alt="Logo"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 80,
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* ===== LEADS ===== */}
                <div
                  style={{
                    background: BG_GRAY,
                    borderRadius: 12,
                    padding: 8,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#2c3e50",
                      marginBottom: 10,
                    }}
                  >
                    <PhoneOutlined style={{ marginRight: 8 }} /> Leads
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: 8,
                    }}
                  >
                    <Button
                      style={navButtonStyle(isActive("/leads/oportunidades"))}
                      onClick={() => navigate("/leads/oportunidades")}
                    >
                      Oportunidades
                    </Button>
                    <Button
                      style={navButtonStyle(isActive("/leads/asignacion"))}
                      onClick={() => navigate("/leads/asignacion")}
                    >
                      Asignación
                    </Button>
                    <Button
                      style={navButtonStyle(isActive("/leads/dashboard"))}
                      onClick={() => navigate("/leads/dashboard")}
                    >
                      Dashboard
                    </Button>
                  </div>
                </div>

                {/* ===== USUARIOS ===== */}
                <div
                  style={{
                    background: BG_GRAY,
                    borderRadius: 12,
                    padding: 8,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#2c3e50",
                      marginBottom: 10,
                    }}
                  >
                    <UserOutlined style={{ marginRight: 8 }} /> Usuarios
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: 8,
                    }}
                  >
                    <Button
                      style={navButtonStyle(isActive("/usuarios/dashboard"))}
                      onClick={() => navigate("/usuarios/dashboard")}
                    >
                      Dashboard
                    </Button>
                    <Button
                      style={navButtonStyle(isActive("/usuarios/crear"))}
                      onClick={() => navigate("/usuarios/crear")}
                    >
                      Crear Usuario
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== BOTÓN DE SOPORTE ===== */}
            <div
              style={{
                padding: 4,
                marginTop: 8,
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              <Button
                type="primary"
                icon={<CustomerServiceOutlined />}
                style={{
                  width: "100%",
                  height: 38,
                  fontWeight: 600,
                }}
              >
                Soporte
              </Button>
            </div>
          </>
        )}
      </aside>

      {/* ===== MAIN (HEADER + CONTENT) ===== */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: BG,
          padding: 8,
          boxSizing: "border-box",
          minWidth: 0,
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
            boxShadow: "0 2px 8px rgba(44,62,80,0.06)",
          }}
        >
          {/* Botón para colapsar/expandir sidebar */}
          <Button
            type="text"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            icon={
              isSidebarCollapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )
            }
          />

          {/* Menú de usuario */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button
              shape="circle"
              icon={<UserOutlined />}
              style={{
                border: "none",
                boxShadow: "0 0 4px rgba(0,0,0,0.1)",
              }}
            />
          </Dropdown>
        </div>

        {/* CONTENT */}
        <div
          style={{
            flex: 1,
            padding: 8,
            marginTop: 8,
            overflow: "auto",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
