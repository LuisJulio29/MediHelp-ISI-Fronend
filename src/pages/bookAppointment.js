import React, { useEffect, useState } from "react";
import CustomLayout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showloading, hideloading } from "../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDoctorData = async () => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideloading());
    }
  };

  const checkAvailabity= async () => {
    try {
      dispatch(showloading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al reservar la cita");
      dispatch(hideloading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showloading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al reservar la cita");
      dispatch(hideloading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <CustomLayout>
      {doctor && (
        <div>
          <h1>
            {doctor.firstName} {doctor.lastName}
          </h1>
          <p>
            Horarios de Atencion: {doctor.timings[0]} - {doctor.timings[1]}
          </p>
          <Row>
            <Col sm={24} xs={24} lg={12}>
              <div className="d-flex flex-column">
                <DatePicker
                  format="DD-MM-YY"
                  onChange={(value) =>{
                    setIsAvailable(false);
                    setDate(value)
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(value);
                  }}
                />
                <Button type="primary" onClick={checkAvailabity}>Chequear Disponibilidad</Button>
               {isAvailable && (
                <Button type="primary" onClick={bookNow}>Agendar Ahora</Button>
               )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </CustomLayout>
  );
}

export default BookAppointment;
