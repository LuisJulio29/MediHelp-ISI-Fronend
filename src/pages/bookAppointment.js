import React, { useEffect, useState } from "react";
import CustomLayout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showloading, hideloading } from "../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button, DatePicker, Row, Col, TimePicker, Avatar, Divider } from "antd";
import { MailOutlined, PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const Navigate = useNavigate();
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideloading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        { doctorId: params.doctorId, date: date, time: time },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al reservar la cita");
      dispatch(hideloading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showloading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
        Navigate("/appointments");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al reservar la cita");
      dispatch(hideloading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <CustomLayout>
      {doctor && (
        <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
          <Row gutter={20} align="middle">
            <Col xs={24} sm={8} lg={6} style={{ textAlign: "center" }}>
              <Avatar
                size={128}
                src="https://via.placeholder.com/128"
                style={{ border: "2px solid #1890ff" }}
              />
            </Col>
            <Col xs={24} sm={16} lg={18}>
              <h2 style={{ marginBottom: 0, fontWeight: "bold", fontSize: "24px" }}>
                {doctor.firstName} {doctor.lastName}
              </h2>
              <p style={{ margin: 0, color: "#888", fontSize: "18px" }}>{doctor.department}</p>
              <Divider />
              <p style={{ marginBottom: "5px", fontSize: "16px" }}>
                <MailOutlined style={{ color: "#1890ff" }} />{" "}
                <span style={{ fontWeight: "bold" }}>{doctor.email}</span>
              </p>
              <p style={{ marginBottom: "5px", fontSize: "16px" }}>
                <PhoneOutlined style={{ color: "#1890ff" }} />{" "}
                <span style={{ fontWeight: "bold" }}>{doctor.phoneNumber}</span>
              </p>
              <p style={{ marginBottom: "5px", fontSize: "16px" }}>
                <ClockCircleOutlined style={{ color: "#1890ff" }} />{" "}
                Horario de atención:<span style={{ fontWeight: "bold" }}> {doctor.timings[0]} -{" "}{doctor.timings[1]} </span>
              </p>
            </Col>
          </Row>

          <Divider />

          <Row justify="center" style={{ marginTop: "20px" }}>
            <Col xs={24} sm={12} lg={10}>
              <DatePicker
                format="DD-MM-YYYY"
                onChange={(value) => {
                  setIsAvailable(false);
                  setDate(value);
                }}
                style={{ width: "100%", marginBottom: "15px", fontWeight: "bold" }}
              />
              <TimePicker
                format="HH:mm"
                onChange={(value) => {
                  setIsAvailable(false);
                  setTime(value);
                }}
                style={{ width: "100%", marginBottom: "15px", fontWeight: "bold" }}
              />
              <Button
                type="primary"
                onClick={isAvailable ? bookNow : checkAvailability}
                block
                style={{
                  backgroundColor: isAvailable ? "#52c41a" : "#1890ff",
                  borderColor: isAvailable ? "#52c41a" : "#1890ff",
                  marginTop: "10px",
                }}
              >
                {isAvailable ? "Agendar Ahora" : "Chequear Disponibilidad"}
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </CustomLayout>
  );
}

export default BookAppointment;
