import React, { useEffect, useState } from 'react'
import CustomLayout from '../components/Layout'
import { useDispatch } from 'react-redux'
import { showloading, hideloading } from "../redux/alertsSlice"
import axios from 'axios'
import { Table, } from 'antd'
import moment from 'moment'


function Appointments() {
  const [appointments, setAppointments] = useState([])
  const dispatch = useDispatch()

  
  const getAppointmentsData = async () => {
    try {
      dispatch(showloading())
      const response = await axios.get('/api/user/get-appointments-by-user-id', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      dispatch(hideloading())
      if (response.data.success) {
        setAppointments(response.data.data)
        console.log(response.data.data)
      }
    } catch (error) {
      dispatch(hideloading())
      console.log(error)
    }
  }


  useEffect(() => {
    getAppointmentsData()
  }, [])


  const columns = [
    
    {
      title: "Doctor",
      dataIndex: "name",
      render: (text, record) => (
        <div className='card-text'>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </div>
      ),
      width: 150,
    },
    {
      title: "Departamento",
      dataIndex: "department",
      render: (text, record) => (
        <div className='card-text'>
          {record.doctorInfo.department}
        </div>
      ),
      width: 150,
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      render: (text, record) => (
        <div className='card-text'>
          {record.date} {moment(record.time, 'HH:mm').format('hh:mm A')}
        </div>
      ),
      width: 200,
    },
    {
      title: "Estado",
      dataIndex: "status",
      width: 120,
    }  
  ]

  return (
    <CustomLayout>
    <div className="container mt-4">
        <h1 className="text-center mb-4">Citas establecidas</h1>

        {/* Tabla responsive */}
        <div className="table-responsive">
          <Table
            dataSource={appointments}
            columns={columns}
            rowKey="_id"
            bordered
            pagination={{ pageSize: 10 }}
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

export default Appointments