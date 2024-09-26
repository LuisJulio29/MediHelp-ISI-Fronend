import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomLayout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { hideloading, showloading } from "../redux/alertsSlice";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  
  const getData = async () => {
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

  useEffect(() => {
    getData();
  }, []);

  return (
    <CustomLayout>
      <Row gutter={[20, 20]}>
        {doctors.map((doctor) => (
          <Col key={doctor._id} span={8} xs={24} sm={12} md={8} lg={6}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </CustomLayout>
  );
}

export default Home;
