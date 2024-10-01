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

  const bookNow = async () => {
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
                  onChange={(value) =>
                    setDate(moment(value).format("DD_MM_YYYY"))
                  }
                />
                <TimePicker
                  format="HH:mm"
                  onChange={(value) => {
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
                <Button type="primary">Chequear Disponibilidad</Button>
                <Button type="primary" onClick={bookNow}>
                  Agendar Ahora{" "}
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </CustomLayout>
  );
}

export default BookAppointment;
