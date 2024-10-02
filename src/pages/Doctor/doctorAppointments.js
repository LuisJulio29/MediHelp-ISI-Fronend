import React, { useEffect, useState } from 'react'
import CustomLayout from '../../components/Layout'
import { useDispatch } from 'react-redux'
import { showloading, hideloading } from "../../redux/alertsSlice"
import axios from 'axios'
import { Button, Space, Table, } from 'antd'
import moment from 'moment'
import { toast } from 'react-hot-toast'


function DoctorAppointmets() {
  const [appointments, setAppointments] = useState([])
  const dispatch = useDispatch()

  
  const getAppointmentsData = async () => {
    try {
      dispatch(showloading())
      const response = await axios.get('/api/doctor/get-appointments-by-doctor-id', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideloading())
      if (response.data.success) {
        setAppointments(response.data.data)
      }
    } catch (error) {
      dispatch(hideloading())
      console.log(error)
    }
  }

  const changeAppointmentStatus = async (record,status) => {
    try {
      dispatch(showloading())
      const response = await axios.post('/api/doctor/change-appointment-status',
        {appointmentId : record._id , status : status}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideloading())
      if (response.data.success) {
        toast.success(response.data.message)
        getAppointmentsData()
      }
    } catch (error) {
      dispatch(hideloading())
      toast.error("Error al cambiar el estado del doctor")
      console.log(error)
    }
  }



  useEffect(() => {
    getAppointmentsData()
  }, [])


  const columns = [
    
    {
      title: "Paciente",
      dataIndex: "name",
      render: (text, record) => (
        <div className='card-text'>
          {record.userInfo.name} 
        </div>
      ),
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (text, record) => (
        <div className='card-text'>
          {record.userInfo.email}
        </div>
      ),
      width: 150,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      render: (text, record) => (
        <div className='card-text'>
          {moment(record.date).format('DD-MM-YYYY')} {moment(record.time, 'HH:mm').format('hh:mm A')}
        </div>
      ),
      width: 200,
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
              <Button type='primary' onClick={()=>changeAppointmentStatus(record, "approved")}>Aprobar</Button>
            )}
            {record.status === "pending" && (
              <Button danger  type='primary'  onClick={()=>changeAppointmentStatus(record, "rejected")}>Desaprobar</Button>
            )}
          </Space>
        ),
        width: 150,
      }
  ]

  return (
    <CustomLayout>
    <div className="container mt-4">
        <h1 className="text-center mb-4">Reservas</h1>

        {/* Tabla responsive */}
        <div className="table-responsive">
          <Table
            dataSource={appointments}
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

export default DoctorAppointmets