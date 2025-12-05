import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ClipboardList } from "lucide-react";
import { Button, Card, Badge, Layout, Spin, Alert } from "antd";
import SelectClient from "../SelectClient/SelectClient";
import "./SalesProcess.css";
import { getCookie } from "../../utils/cookies";
import { jwtDecode } from "jwt-decode";

const { Content } = Layout;


interface TokenData {
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

interface Opportunity {
  id: number;
  personaNombre: string;
  nombreEstado: string;
  productoNombre: string;
  fechaCreacion: string;
  fechaRecordatorio: string | null;
}


const SalesCard = ({ sale }: { sale: Opportunity }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/leads/oportunidades/${sale.id}`);
  };

  // Función para verificar si el recordatorio aún está vigente (no ha pasado)
  const isReminderActive = (fechaRecordatorio: string): boolean => {
    const now = new Date();
    const reminderDate = new Date(fechaRecordatorio);
    // Retorna true si la fecha del recordatorio es mayor a la fecha actual
    return reminderDate.getTime() > now.getTime();
  };

  // Función para determinar el color del recordatorio basado en el tiempo restante
  const getReminderColor = (fechaRecordatorio: string): string => {
    // Obtener fecha y hora actual del sistema
    const now = new Date();
    // Parsear la fecha y hora del recordatorio
    const reminderDate = new Date(fechaRecordatorio);

    // Calcular la diferencia en milisegundos
    const timeDifference = reminderDate.getTime() - now.getTime();

    // Convertir a horas (1000ms * 60s * 60min = 1 hora)
    const hoursRemaining = timeDifference / (1000 * 60 * 60);

    // Determinar el color según las horas restantes:
    // - Rojo: 5 horas o menos
    // - Amarillo: más de 5 horas pero menos de 24 horas
    // - Azul: 24 horas o más
    if (hoursRemaining <= 5) {
      return '#ff4d4f'; // Rojo
    } else if (hoursRemaining < 24) {
      return '#ffd666'; // Amarillo dorado suave
    } else {
      return '#1677ff'; // Azul
    }
  };

  return (
    <Card size="small" className="client-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="client-name">{sale.personaNombre}</div>
      <div className="client-price">{sale.productoNombre}</div>

      <div className="client-date">
        <Calendar size={14} /> <span>{new Date(sale.fechaCreacion).toLocaleDateString()}</span>
      </div>
      {sale.fechaRecordatorio && isReminderActive(sale.fechaRecordatorio) && (
        <div style={{
          marginTop: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: getReminderColor(sale.fechaRecordatorio),
          color: '#ffffff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500
        }}>
          <ClipboardList size={12} />
          <span>
            Recordatorio:{" "}
            {new Date(sale.fechaRecordatorio).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            {new Date(sale.fechaRecordatorio).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </span>
        </div>
      )}
    </Card>
  );
};


export default function SalesProcess() {
  const [activeFilter, setActiveFilter] = useState("todos");
  const [isSelectClientModalVisible, setIsSelectClientModalVisible] = useState(false);
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = getCookie("token");

  let idUsuario = 0;
  let rolNombre = "";

  if (token) {
    try {
      const decoded = jwtDecode<TokenData>(token);
      idUsuario = parseInt(
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || "0"
      );
      rolNombre =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
    } catch (e) {
      console.error("Error al decodificar token", e);
    }
  }

  const rolesMap: Record<string, number> = {
    Asesor: 1,
    Supervisor: 2,
    Gerente: 3,
    Administrador: 4,
    Desarrollador: 5,
  };

  const idRol = rolesMap[rolNombre] ?? 0;

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/VTAModVentaOportunidad/ObtenerTodasConRecordatorio?idUsuario=${idUsuario}&idRol=${idRol}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Error al obtener oportunidades");

        const data = await response.json();
        setOpportunities(data.oportunidad || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOpportunities();
  }, [idUsuario, idRol, token]);

  const categorizedData = useMemo(() => {
    const initialSalesData = {
      registrado: [],
      calificado: [],
      potencial: [],
      promesa: [],
    } as Record<string, Opportunity[]>;

    const initialOtrosEstados = {
      pendiente: [],
      matriculado: [],
      noCalificado: [],
      coorporativo: [],
    } as Record<string, Opportunity[]>;

    opportunities.forEach((op) => {
      switch (op.nombreEstado) {
        case "Registrado":
          initialSalesData.registrado.push(op);
          break;
        case "Potencial":
          initialSalesData.potencial.push(op);
          break;
        case "Promesa":
          initialSalesData.promesa.push(op);
          break;
        case "Calificado":
          initialSalesData.calificado.push(op);
          break;
        case "Matriculado":
          initialOtrosEstados.matriculado.push(op);
          break;
        case "No calificado":
          initialOtrosEstados.noCalificado.push(op);
          break;
        default:
          break;
      }
    });

    // ORDENAR DESC COMO EL ORIGINAL
    const sortByFechaDesc = (a: Opportunity, b: Opportunity) =>
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();

    Object.values(initialSalesData).forEach((arr) => arr.sort(sortByFechaDesc));
    Object.values(initialOtrosEstados).forEach((arr) => arr.sort(sortByFechaDesc));

    return { salesData: initialSalesData, otrosEstados: initialOtrosEstados };
  }, [opportunities]);

  const { salesData, otrosEstados } = categorizedData;

  // =============================
  // LOADING / ERROR (IGUAL)
  // =============================
  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );

  if (error)
    return <Alert message="Error" description={error} type="error" showIcon />;

  // =============================
  // 🌐 RENDER COMPLETO (IGUALITO)
  // =============================
  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ padding: "20px", background: "#f5f5f5" }}>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button onClick={() => setIsSelectClientModalVisible(true)}>
            Agregar Oportunidad
          </Button>

          <Button type="primary" style={{ background: "#1f1f1f", borderColor: "#1f1f1f" }}>
            Vista de Proceso
          </Button>

          <Button onClick={() => navigate("/leads/Opportunities")}>
            Vista de Tabla
          </Button>
        </div>

        <SelectClient
          visible={isSelectClientModalVisible}
          onClose={() => setIsSelectClientModalVisible(false)}
        />

        <div className="content-wrapper">
          <h1 className="page-title">Proceso de Ventas</h1>

          {/* ---- COLUMNA PRINCIPAL ---- */}
          <div className="sales-section">
            <div className="stages-grid">
              {Object.entries(salesData).map(([stage, items]) => (
                <div key={stage} className={`stage-column ${stage}`}>
                  <div className="stage-header">
                    <span className="stage-title">
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </span>
                    <Badge count={items.length} style={{ backgroundColor: "#1677ff" }} />
                  </div>

                  <div className="card-list-container">
                    {items.map((sale) => (
                      <SalesCard key={sale.id} sale={sale} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ---- OTROS ESTADOS ---- */}
          <div className="sales-section">
            <div className="other-states-header">
              <h3>Otros Estados</h3>
            </div>

            <div className="other-states-grid">
              {Object.entries(otrosEstados).map(([estado, items]) => (
                <div key={estado} className="other-state-column">
                  <div className="column-header">
                    <span>{estado.charAt(0).toUpperCase() + estado.slice(1)}</span>
                    <Badge count={items.length} style={{ backgroundColor: "#1677ff" }} />
                  </div>

                  <div className={`state-content ${estado}`}>
                    {items.length > 0 ? (
                      items.map((sale) => <SalesCard key={sale.id} sale={sale} />)
                    ) : (
                      <div className="empty-box"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
