import React from 'react' 
import CustomLayout from '../components/Layout'
import { Tabs, Button, Card } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { hideloading, showloading } from '../redux/alertsSlice'
import { setUser } from '../redux/userSlice'

function Notifications() {
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const markAllAsSeen = async () => {
    try {
      dispatch(showloading())
      const response = await axios.post("api/user/mark-all-notifications-as-seen", { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      dispatch(hideloading())
      if (response.data.success) {
        toast.success(response.data.message)
        dispatch(setUser(response.data.data))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      dispatch(hideloading())
      toast.error("Algo mal ha pasado :(")
    }
  }

  const deleteAll = async () => {
    try {
      dispatch(showloading())
      const response = await axios.post("api/user/delete-all-notifications", { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      )
      dispatch(hideloading())
      if (response.data.success) {
        toast.success(response.data.message)
        dispatch(setUser(response.data.data))
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      dispatch(hideloading())
      toast.error("Algo mal ha pasado :(")
    }
  }

  return (
    <CustomLayout>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Notificaciones</h1>

        <Tabs type="card" centered>
          <Tabs.TabPane tab="No Vistas" key="1">
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <h5>Notificaciones No Vistas</h5>
              <Button onClick={markAllAsSeen} type="primary">Marcar todo</Button>
            </div>

            {user?.unseenNotifications?.length > 0 ? (
              user.unseenNotifications.map((notification, index) => (
                <Card
                  key={index}
                  className="mb-3"
                  hoverable
                  onClick={() => navigate(notification.onclick)}
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Card.Meta
                    description={notification.message}
                  />
                </Card>
              ))
            ) : (
              <div className="text-center">
                <p>No tienes notificaciones no vistas</p>
              </div>
            )}
          </Tabs.TabPane>

          <Tabs.TabPane tab="Vistas" key="2">
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <h5>Notificaciones Vistas</h5>
              <Button type="primary" danger onClick={deleteAll}>Eliminar Todo</Button>
            </div>

            {user?.seenNotifications?.length > 0 ? (
              user.seenNotifications.map((notification, index) => (
                <Card
                  key={index}
                  className="mb-3"
                  hoverable
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Card.Meta
                    description={notification.message}
                  />
                </Card>
              ))
            ) : (
              <div className="text-center">
                <p>No tienes notificaciones vistas</p>
              </div>
            )}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </CustomLayout>
  )
}

export default Notifications
