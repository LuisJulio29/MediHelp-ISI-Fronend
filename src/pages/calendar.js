import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLayout from "../components/Layout";
import { Calendar, Badge } from "antd";
import { useDispatch } from "react-redux";
import { hideloading, showloading } from "../redux/alertsSlice";

function CalendarView() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  // Obtener citas del usuario
  const getAppointments = async () => {
    try {
      dispatch(showloading());
      const response = await axios.get(
        "/api/user/get-appointments-by-user-id",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideloading());
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  // Función para obtener las citas por fecha
  const getListData = (value) => {
    let listData;
    const date = value.format("DD-MM-YYYY");
    const currentappointments = appointments.filter(
      (appointment) => appointment.date === date
    );

    if (currentappointments.length) {
      listData = currentappointments.map((appointment) => ({
        type: "success", // Cambia según el estado de la cita si lo necesitas
        content: `Cita con ${appointment.doctorInfo.firstName} a las ${appointment.time}`,
      }));
    }

    return listData || [];
  };

  // Renderizar citas en el calendario
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item, index) => (
          <Badge
            key={index}
            status={item.type}
            text={<span style={{ whiteSpace: "normal" }}>{item.content}</span>}
          />
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  return (
    <CustomLayout>
      <div className="container">
        <h1 className="text-center mb-4">Calendario</h1>
        <div className="table-responsive">
          <Calendar cellRender={cellRender} />
        </div>
      </div>
    </CustomLayout>
  );
}

export default CalendarView;
