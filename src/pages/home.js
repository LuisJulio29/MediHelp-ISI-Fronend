import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLayout from "../components/Layout";
import { Col, Row, Tabs } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { hideloading, showloading } from "../redux/alertsSlice";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
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
    getDoctors();
  }, [dispatch]);

  // Función para filtrar doctores por sede
  const filterDoctorsByDepartment = (department) => {
    return doctors.filter((doctor) => doctor.department === department);
  };

  return (
    <CustomLayout>
      <div className="container">
      <h1 className="text-center mb-4">Reservar Citas </h1>
        {/* Pestañas para las sedes */}
        <Tabs type="card" centered>
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
      </div>
    </CustomLayout>
  );
}

export default Home;


