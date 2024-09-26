import React, { useEffect, useState } from 'react'
import CustomLayout from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { showloading, hideloading } from "../../redux/alertsSlice"
import axios from 'axios'
import { Button, Table, Space } from 'antd'
import {toast} from 'react-hot-toast'


function DoctorList() {
  const [doctors, setDoctors] = useState([])
  const dispatch = useDispatch()

  // Función para obtener los datos de los doctores
  const getDoctorsData = async () => {
    try {
      dispatch(showloading())
      const response = await axios.get('/api/admin/get-all-doctors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideloading())
      if (response.data.success) {
        setDoctors(response.data.data)
      }
    } catch (error) {
      dispatch(hideloading())
      console.log(error)
    }
  }

  const changeDoctorStatus = async (record,status) => {
    try {
      dispatch(showloading())
      const response = await axios.post('/api/admin/change-doctor-status',
        {doctorId:record._id , userId:record.userId, status:status}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideloading())
      if (response.data.success) {
        toast.success(response.data.message)
        getDoctorsData()
      }
    } catch (error) {
      dispatch(hideloading())
      toast.error("Error al cambiar el estado del doctor")
      console.log(error)
    }
  }

  useEffect(() => {
    getDoctorsData()
  }, [])

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      render: (text, record) => (
        <div className='card-text'>
          {record.firstName} {record.lastName}
        </div>
      ),
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
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
            <Button type='primary' onClick={()=>changeDoctorStatus(record, "approved")}>Aprobar</Button>
          )}
          {record.status === "approved" && (
            <Button danger  type='primary'  onClick={()=>changeDoctorStatus(record, "blocked")}>Desaprobar</Button>
          )}
        </Space>
      ),
      width: 150,
    }
  ]

  return (
    <CustomLayout>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Lista de Doctores</h1>

        {/* Tabla responsive */}
        <div className="table-responsive">
          <Table
            dataSource={doctors}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }} // Hacer que la tabla sea desplazable horizontalmente en pantallas pequeñas
            className="shadow-sm"
          />
        </div>
      </div>

      {/* Estilos adicionales */}
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

export default DoctorList
