import React from "react";
import { Card, Avatar, Button } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

function Doctor({ doctor }) {
  const navigate = useNavigate();
  return (
    <Card
      hoverable
      style={{ margin: "20px 0", borderRadius: "10px" }}
      cover={
        <img
          alt="Doctor"
          src="https://via.placeholder.com/300"
          style={{ height: "200px", objectFit: "cover" }}
        />
      }
      onClick={() => navigate(`/book-appointment/${doctor._id}`)}
    >
      <Card.Meta
        avatar={<Avatar size={64} src="https://via.placeholder.com/64" />}
        title={`${doctor.firstName} ${doctor.lastName}`}
        description={doctor.department}
        style={{ marginBottom: "20px" }}
      />
      <p>
        <MailOutlined /> {doctor.email}
      </p>
      <p>
        <PhoneOutlined /> {doctor.phoneNumber}
      </p>
      <p>
        <ClockCircleOutlined /> {doctor.timings[0]} - {doctor.timings[1]}
      </p>
      <Button type="primary" block>
        Reservar Cita
      </Button>
    </Card>
  );
}

export default Doctor;
