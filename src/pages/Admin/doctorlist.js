import React, { useEffect, useState } from "react";
import CustomLayout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { showloading, hideloading } from "../../redux/alertsSlice";
import axios from "axios";
import { Button, Table, Space, Modal, Form, Input, TimePicker } from "antd";
import { toast } from "react-hot-toast";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showloading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const handleCreateDoctor = async (values) => {
    try {
      dispatch(showloading());
      const timings = values.timings.map((time) => time.format("HH:mm"));
      const response = await axios.post(
        "/api/admin/create-doctor",
        { ...values, timings },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsModalOpen(false);
        form.resetFields();
        getDoctorsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideloading());
      toast.error("Error al crear el doctor");
      console.log(error);
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        '/api/admin/change-doctor-status',
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorsData();
      }
    } catch (error) {
      dispatch(hideloading());
      toast.error('Error al cambiar el estado del doctor');
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      render: (text, record) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: "150px" }}>
          {record.firstName} {record.lastName}
        </span>
      ),
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text) => (
        <span className="text-truncate d-inline-block" style={{ maxWidth: "200px" }}>
          {text}
        </span>
      ),
      width: 200,
    },
    {
      title: "Departamento",
      dataIndex: "department",
      width: 150,
    },
    {
      title: "Estado",
      dataIndex: "status",
      width: 120,
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      render: (text, record) => (
        <Space size="middle">
          {record.status === "pending" && (
            <Button
              className="btn btn-primary btn-sm"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              Aprobar
            </Button>
          )}
          {record.status === "approved" && (
            <Button
              className="btn btn-danger btn-sm"
              onClick={() => changeDoctorStatus(record, "blocked")}
            >
              Desaprobar
            </Button>
          )}
        </Space>
      ),
      width: 150,
    },
  ];

  return (
    <CustomLayout>
      <div className="container mt-4 p-4 bg-light rounded">
        <h1 className="text-center mb-4">Lista de Doctores</h1>
        <div className="mb-3 text-end">
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Añadir Doctor
          </Button>
        </div>
        <div className="table-responsive">
          <Table
            dataSource={doctors}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
            className="shadow-sm"
          />
        </div>
        <Modal
          title="Añadir Doctor"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form layout="vertical" form={form} onFinish={handleCreateDoctor}>
            <Form.Item name="firstName" label="Nombre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Apellido" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Correo Electrónico" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Teléfono" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="department" label="Departamento" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="timings" label="Horario" rules={[{ required: true }]}>
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
            <Form.Item name="code" label="Código de Usuario" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <div className="text-end">
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </CustomLayout>
  );
}

export default DoctorList;
