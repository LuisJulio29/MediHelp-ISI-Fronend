import React from "react";
import CustomLayout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showloading, hideloading } from "../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";

function ApplyDoctor() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showloading());
      console.log("timmings iniciales",values.timings);
      const response = await axios.post(
        "/api/user/apply-doctor-account",
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideloading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideloading());
      console.log(error);
      toast.error("Algo mal ha pasado :(");
    }
  };

  return (
    <CustomLayout>
      <DoctorForm onFinish={onFinish} />
    </CustomLayout>
  );
}

export default ApplyDoctor;
