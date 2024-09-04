import React from "react";
import { useEffect } from "react";
import axios from "axios";
import CustomLayout from "../components/layout";

function Home() {
  const getData = async () => {
    try {
      const response = await axios.post(
        "api/user/get-user-info-by-id",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return <CustomLayout><h1> Home </h1></CustomLayout>
}

export default Home;
