import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLayout from "../components/Layout";
import { Col, Row, Calendar, Badge, Tabs } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { hideloading, showloading } from "../redux/alertsSlice";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  // Obtener doctores aprobados
  const getDoctors = async () => {
    try {
      dispatch(showloading());
      const response = await axios.get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideloading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideloading());
      console.log(error);
    }
  };

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
    getDoctors();
    getAppointments();
  }, []);

  // Función para obtener todas las citas
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

  // Función para mostrar las citas en el calendario
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

  // Función para filtrar doctores por sede
  const filterDoctorsByDepartment = (department) => {
    return doctors.filter((doctor) => doctor.department === department);
  };

  return (
    <CustomLayout>
      <div className="container mt-4">
        <div className="table-responsive">
          <Calendar cellRender={cellRender} />
        </div>
      </div>

      {/* Pestañas para las sedes */}
      <Tabs type="card" centered className="mt-4">
        <Tabs.TabPane tab="La Merced" key="1">
          <Row gutter={[20, 20]}>
            {filterDoctorsByDepartment("La Merced").map((doctor) => (
              <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
                <Doctor doctor={doctor} />
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Piedra de Bolívar" key="2">
          <Row gutter={[20, 20]}>
            {filterDoctorsByDepartment("Piedra De Bolivar").map((doctor) => (
              <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
                <Doctor doctor={doctor} />
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="San Agustín" key="3">
          <Row gutter={[20, 20]}>
            {filterDoctorsByDepartment("San Agustin").map((doctor) => (
              <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
                <Doctor doctor={doctor} />
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
        <Tabs.TabPane tab="San Pablo" key="4">
          <Row gutter={[20, 20]}>
            {filterDoctorsByDepartment("San Pablo").map((doctor) => (
              <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
                <Doctor doctor={doctor} />
              </Col>
            ))}
          </Row>
        </Tabs.TabPane>
      </Tabs>
    </CustomLayout>
  );
}

export default Home;
