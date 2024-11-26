import React, { useEffect, useState } from "react";
import CustomLayout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showloading, hideloading } from "../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { DatePicker, Row, Col, Avatar, Divider, Card } from "antd";
import { MailOutlined, PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";

function BookAppointment() {
  const [date, setDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

 

  const fetchAvailableSlots = async (selectedDate) => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        "/api/user/get-available-slots",
        { doctorId: params.doctorId, date: selectedDate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        setAvailableSlots(response.data.data);
      } else {
        toast.error(response.data.message);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al obtener los horarios disponibles");
      dispatch(hideloading());
    }
  };

  const bookAppointment = async (time) => {
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
          time,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/appointments");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al reservar la cita");
      dispatch(hideloading());
    }
  };

  useEffect(() => {
    const getDoctorData = async () => {
      try {
        dispatch(showloading());
        const response = await axios.post(
          "/api/doctor/get-doctor-info-by-id",
          { doctorId: params.doctorId },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
    getDoctorData();
  }, [dispatch, params.doctorId]);

  return (
    <CustomLayout>
      {doctor && (
        <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
          {/* Información del Doctor */}
          <Row gutter={20} align="middle">
            <Col xs={24} sm={8} lg={6} style={{ textAlign: "center" }}>
              <Avatar size={128} src="https://via.placeholder.com/128" style={{ border: "2px solid #1890ff" }} />
            </Col>
            <Col xs={24} sm={16} lg={18}>
              <h2 style={{ fontWeight: "bold", fontSize: "24px" }}>
                {doctor.firstName} {doctor.lastName}
              </h2>
              <p style={{ color: "#888", fontSize: "18px" }}>{doctor.department}</p>
              <Divider />
              <p style={{ fontSize: "16px" }}>
                <MailOutlined style={{ color: "#1890ff" }} /> {doctor.email}
              </p>
              <p style={{ fontSize: "16px" }}>
                <PhoneOutlined style={{ color: "#1890ff" }} /> {doctor.phoneNumber}
              </p>
              <p style={{ fontSize: "16px" }}>
                <ClockCircleOutlined style={{ color: "#1890ff" }} /> Horario:{" "}
                <strong>
                  {doctor.timings[0]} - {doctor.timings[1]}
                </strong>
              </p>
            </Col>
          </Row>

          <Divider />

          {/* Selección de Fecha y Horarios */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <DatePicker
              format="DD-MM-YYYY"
              onChange={(value) => {
                const formattedDate = value.format("DD-MM-YYYY");
                setDate(formattedDate);
                fetchAvailableSlots(formattedDate);
              }}
              style={{ width: "100%", maxWidth: "600px" }}
            />
          </div>

          <Row gutter={[16, 16]} justify="center">
            {availableSlots.map((slot) => (
              <Col sm={12} md={8} lg={6} key={slot}>
                <Card
                  hoverable
                  style={{ textAlign: "center", background: "#e6f7ff", borderColor: "#1890ff" }}
                  onClick={() => bookAppointment(slot)}
                >
                  <strong style={{ color: "#1890ff", fontSize: "16px" }}>{slot}</strong>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </CustomLayout>
  );
}

export default BookAppointment;
