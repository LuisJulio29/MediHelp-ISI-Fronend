import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import React from "react";

function DoctorForm(onFinish) {
  return (
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
  );
}

export default DoctorForm;
