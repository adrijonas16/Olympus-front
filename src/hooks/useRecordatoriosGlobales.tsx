import { useEffect, useRef } from "react";
import { notification } from "antd";
import api from "../servicios/api";
import type { NavigateFunction } from "react-router-dom";

export const useRecordatoriosGlobales = (
  idUsuario: number,
  apiNotification: ReturnType<typeof notification.useNotification>[0],
  navigate: NavigateFunction
) => {
  const notificados = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!idUsuario) return;

    const consultar = async () => {
      try {
        const res = await api.get(
          `/api/VTAModVentaOportunidad/RecordatoriosActivos/${idUsuario}`
        );

        const lista = res.data?.historialInteracciones ?? [];

        lista.forEach((r: any) => {
          const claveNotificacion = `${r.id}-${r.fechaRecordatorio}`;

          if (notificados.current.has(claveNotificacion)) return;

          notificados.current.add(claveNotificacion);

          const key = `recordatorio-${claveNotificacion}`;

          apiNotification.warning({
            key,
            message: "Recordatorio pendiente",
            description: r.detalle,
            placement: "topRight",
            duration: 0,
            btn: (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={async () => {
                    try {
                      await api.post(
                        `/api/VTAModVentaOportunidad/DesactivarRecordatorio/${r.id}`
                      );
                      apiNotification.destroy(key);
                    } catch (e) {
                      console.error("Error desactivando recordatorio", e);
                    }
                  }}
                  style={{
                    background: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Desactivar
                </button>

                <button
                  onClick={() => {
                    apiNotification.destroy(key);
                    navigate(`/leads/oportunidades/${r.idOportunidad}`);
                  }}
                  style={{
                    background: "#1677ff",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "4px 8px",
                    cursor: "pointer",
                  }}
                >
                  Ir a oportunidad
                </button>
              </div>
            ),
          });
        });
      } catch (err) {
        console.error("Error consultando recordatorios", err);
      }
    };

    consultar();
    const interval = setInterval(consultar, 60000);

    return () => clearInterval(interval);
  }, [idUsuario]);
};
