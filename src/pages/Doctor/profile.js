import React, { useEffect, useState } from "react";
import CustomLayout from "../../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showloading, hideloading } from "../../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import DoctorForm from "../../components/DoctorForm";


function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const params = useParams(); 
    const [doctor,setDoctor]=useState(null);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        try {
          dispatch(showloading());
          const response = await axios.post(
            "/api/doctor/update-doctor-profile",
            {
              ...values,
              userid: user._id,
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
          toast.error("Algo mal ha pasado :(");
        }
      };

      const getDoctorData = async () => {
        try {
            dispatch(showloading());
          const response = await axios.post(
            "/api/doctor/get-doctor-info-by-user-id",
            {
                userId:params.userId,
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
            console.log(response.data.data);
          }
        } catch (error) {
            console.log(error);
            dispatch(hideloading());
        }
      };

    useEffect(() => {
        getDoctorData();
        
    }, []);

  return (
    <CustomLayout>
        <h1>Profile</h1>
       {doctor && <DoctorForm onFinish={onFinish} initialValues={doctor}/>}
    </CustomLayout>
  )
}

export default Profile