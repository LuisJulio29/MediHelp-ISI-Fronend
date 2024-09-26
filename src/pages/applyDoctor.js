import React from "react";
import { Form, Input, Button, Row, Col, TimePicker } from "antd";
import CustomLayout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showloading, hideloading } from "../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ApplyDoctor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showloading());
      const response = await axios.post("api/user/apply-doctor-account", {
        ...values,
        userid: user._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideloading());
      toast.error("Algo mal ha pasado :(");
    }
  };

  return (
    <CustomLayout>
      <Form
        layout="vertical"
        onFinish={onFinish}
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {/* Sección 1: Datos Personales */}
        <div className="mb-4">
          <h3 className="mb-3">Datos Personales</h3>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="firstName"
                label="Nombre"
                rules={[
                  { required: true, message: "Por favor ingresa tu nombre" },
                ]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="lastName"
                label="Apellido"
                rules={[
                  { required: true, message: "Por favor ingresa tu apellido" },
                ]}
              >
                <Input placeholder="Apellido" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="phoneNumber"
                label="Número Telefónico"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu número telefónico",
                  },
                ]}
              >
                <Input placeholder="Número Telefónico" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Sección 2: Datos Profesionales */}
        <div className="mb-4">
          <h3 className="mb-3">Datos Profesionales</h3>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="department"
                label="Departamento"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa tu departamento",
                  },
                ]}
              >
                <Input placeholder="Departamento" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Dirección de Correo Electrónico"
                rules={[
                  { required: true, message: "Por favor ingresa tu dirección" },
                ]}
              >
                <Input placeholder="Correo Electronico" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="timings"
                label="Horario Laboral"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa su horario laboral",
                  },
                ]}
              >
                <TimePicker.RangePicker />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Botón de envío */}
        <div className="text-center">
          <Button type="primary" htmlType="submit" className="w-50 w-md-auto">
            Enviar
          </Button>
        </div>
      </Form>
    </CustomLayout>
  );
}

export default ApplyDoctor;
