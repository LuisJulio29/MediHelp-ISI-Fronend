import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLayout from "../components/Layout";
import { Col, Row, Tabs, Input } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { hideloading, showloading } from "../redux/alertsSlice";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filterDoctorsByDepartment = (department) => {
    return doctors
      .filter(
        (doctor) =>
          doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((doctor) => doctor.department === department);
  };

  const tabsItems = [
    {
      label: "La Merced",
      key: "1",
      children: (
        <Row gutter={[20, 20]}>
          {filterDoctorsByDepartment("La Merced").map((doctor) => (
            <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
        </Row>
      ),
    },
    {
      label: "Piedra de Bolívar",
      key: "2",
      children: (
        <Row gutter={[20, 20]}>
          {filterDoctorsByDepartment("Piedra De Bolivar").map((doctor) => (
            <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
        </Row>
      ),
    },
    {
      label: "San Agustín",
      key: "3",
      children: (
        <Row gutter={[20, 20]}>
          {filterDoctorsByDepartment("San Agustin").map((doctor) => (
            <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
        </Row>
      ),
    },
    {
      label: "San Pablo",
      key: "4",
      children: (
        <Row gutter={[20, 20]}>
          {filterDoctorsByDepartment("San Pablo").map((doctor) => (
            <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
        </Row>
      ),
    },
  ];

  return (
    <CustomLayout>
      <div className="container">
        <h1 className="text-center mb-4">Reservar Citas</h1>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <Input
            placeholder="Buscar doctor por nombre o apellido"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "440px", width: "100%" }}
          />
        </div>
        <div className="tabs-container">
          <Tabs
            type="card"
            centered
            items={tabsItems}
            tabPosition= "top"
          />
        </div>
      </div>
    </CustomLayout>
  );
}

export default Home;

