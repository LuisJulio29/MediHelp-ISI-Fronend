import React, { useEffect, useState, useMemo, useCallback } from "react";
import CustomLayout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { showloading, hideloading } from "../../redux/alertsSlice";
import axios from "axios";
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  TimePicker,
  Popconfirm,
  message,
  Select,
} from "antd";


// Custom hook for fetching and managing doctors
const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = useCallback(
    async (searchTerm = "") => {
      try {
        dispatch(showloading());
        const response = await axios.get("/api/admin/get-all-doctors", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          // Filter doctors based on name or email
          const filteredDoctors = response.data.data.filter((doctor) =>
            `${doctor.firstName} ${doctor.lastName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );
          setDoctors(filteredDoctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        message.error("No se pudieron cargar los doctores");
      } finally {
        dispatch(hideloading());
      }
    },
    [dispatch]
  );

  const changeDoctorStatus = useCallback(
    async (record, status) => {
      try {
        dispatch(showloading());
        const response = await axios.post(
          "/api/admin/change-doctor-status",
          { doctorId: record._id, userId: record.userId, status: status },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          message.success(response.data.message);
          await getDoctorsData(); // Refresh doctors after status change
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Error al cambiar el estado del doctor");
        console.error(error);
      } finally {
        dispatch(hideloading());
      }
    },
    [getDoctorsData, dispatch]
  );

  const createDoctor = useCallback(
    async (values, form, setIsModalOpen) => {
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

        if (response.data.success) {
          message.success(response.data.message);
          setIsModalOpen(false);
          form.resetFields();
          await getDoctorsData();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        message.error("Error al crear el doctor");
        console.error(error);
      } finally {
        dispatch(hideloading());
      }
    },
    [getDoctorsData, dispatch]
  );

  return { doctors, getDoctorsData, changeDoctorStatus, createDoctor };
};

function DoctorList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const { doctors, getDoctorsData, changeDoctorStatus, createDoctor } =
    useDoctors();
  const { Option } = Select;

  useEffect(() => {
    getDoctorsData(searchTerm);
  }, [searchTerm, getDoctorsData]);

  const columns = useMemo(
    () => [
      {
        title: "Nombre",
        dataIndex: "name",
        render: (text, record) => (
          <span
            className="text-truncate d-inline-block"
            style={{ maxWidth: "150px" }}
          >
            {record.firstName} {record.lastName}
          </span>
        ),
        sorter: (a, b) =>
          `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          ),
        width: 150,
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (text) => (
          <span
            className="text-truncate d-inline-block"
            style={{ maxWidth: "200px" }}
          >
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
            <Popconfirm
              title="¿Estás seguro de desaprobar a este doctor?"
              onConfirm={() => changeDoctorStatus(record, "blocked")}
              okText="Sí"
              cancelText="No"
            >
              {record.status === "approved" && (
                <Button danger type="primary">
                  Desaprobar
                </Button>
              )}
            </Popconfirm>
          </Space>
        ),
        width: 150,
      },
    ],
    [changeDoctorStatus]
  );

  const handleCreateDoctor = (values) => {
    createDoctor(values, form, setIsModalOpen);
  };

  return (
    <CustomLayout>
      <div className="container mt-4 p-4 bg-light rounded">
        <h1 className="text-center mb-4">Lista de Doctores</h1>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Input
            placeholder="Buscar doctor por nombre o email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "600px", width: "100%" }}
          />
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            className="ml-auto"
          >
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
            <Form.Item
              name="firstName"
              label="Nombre"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Apellido"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Correo Electrónico"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Teléfono"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="department"
              label="Departamento"
              rules={[{ required: true }]}
            >
              <Select placeholder="Selecciona un departamento">
                <Option value="Piedra De Bolivar">Piedra De Bolivar</Option>
                <Option value="San Pablo">San Pablo</Option>
                <Option value="San Agustin">San Agustin</Option>
                <Option value="Zaragocilla">Zaragocilla</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="timings"
              label="Horario"
              rules={[{ required: true }]}
            >
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
            <Form.Item
              name="code"
              label="Código de Usuario"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Contraseña"
              rules={[{ required: true }]}
            >
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
