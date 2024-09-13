import React, { useEffect, useState } from 'react'
import CustomLayout from '../../components/layout'
import { useDispatch } from 'react-redux'
import { showloading, hideloading } from "../../redux/alertsSlice"
import axios from 'axios'
import { Table, Button, Space } from 'antd'

function UserList() {
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()

  const getUsersData = async () => {
    try {
      dispatch(showloading())
      const response = await axios.get('/api/admin/get-all-users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideloading())
      if (response.data.success) {
        setUsers(response.data.data)
      }
    } catch (error) {
      dispatch(hideloading())
      console.log(error)
    }
  }

  useEffect(() => {
    getUsersData()
  }, [])

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Creado en",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
      width: 100,
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" danger>
            Bloquear
          </Button>
          <Button type="default">
            Editar
          </Button>
        </Space>
      ),
      width: 150,
    },
  ]

  return (
    <CustomLayout>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Lista de Usuarios</h1>

        {/* Ajustar la tabla para ser responsive */}
        <div className="table-responsive">
          <Table
            dataSource={users}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }} // Hacer que la tabla sea desplazable horizontalmente en pantallas pequeñas
            className="shadow-sm"
          />
        </div>
      </div>

      {/* Estilos adicionales para hacer que el diseño sea más responsive */}
      <style jsx>{`
        .container {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
        }

        @media (max-width: 576px) {
          .container {
            padding: 10px;
            margin: 0;
          }

          h1 {
            font-size: 1.5rem;
          }

          .table-responsive {
            border-radius: 0;
          }
        }
      `}</style>
    </CustomLayout>
  )
}

export default UserList
