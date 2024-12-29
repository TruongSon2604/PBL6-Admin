import React, { useState, useEffect } from "react";
import { assets } from "../../assets/assets.js";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AddVoucher = ({ url }) => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    discountPercent: "",
    description: "",
    startDate:"",
    endDate:""
  });

  //get user
  const [cate, setCate] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [bestSale, setbestSale] = useState("");
  const token = localStorage.getItem("access_token");

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const formatDateTime = (dateTime) => {
    return dateTime.replace("T", " ") + ":00"; // Thêm giây nếu cần
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const tk = localStorage.getItem("access_token");
  
    if (!tk) {
      toast.error("Access token is missing");
      return;
    }
  
    const headers = {
      Authorization: `Bearer ${tk}`,
      "Content-Type": "application/json", // Đảm bảo định dạng JSON
    };
  
    const jsonData = {
      discountPercent: data.discountPercent,
      description: data.description,
      startDate: formatDateTime(data.startDate), // Chuyển đổi định dạng
      endDate: formatDateTime(data.endDate), // Chuyển đổi định dạng
    };
  
    try {
      const response = await axios.post(
        `${url}/api/v1/admin/voucher/add`,
        JSON.stringify(jsonData), // Chuyển đổi dữ liệu sang chuỗi JSON
        { headers }
      );
  
      if (response.data.message) {
        setData({
          discountPercent: "",
          description: "",
          startDate: "",
          endDate: "",
        });
        toast.success("Added Promotion");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        toast.error(error.response.data.message || "Something went wrong.");
      } else {
        console.error("Error:", error.message);
        toast.error("Something went wrong.");
      }
    }
  };
  

    useEffect(() => {
      console.log("data", data);
  
      console.log("discountPercent", data.discountPercent);
      console.log("description", data.description);
      console.log("startDate", data.startDate);
      console.log("startDate", data.endDate);
    });
  

  return (
    <div className="add add-product">
      <div className="cover-left1">
        <h2 className="">Add Voucher</h2>
        <form className="flex-col" onSubmit={onSubmitHandler}>
          <table className="form-table">
            <tbody>
              <tr>
                <td>discountPercent</td>
                <td>
                  <input
                    onChange={onChangeHandler}
                    value={data.discountPercent}
                    type="text"
                    name="discountPercent"
                    placeholder="Type here"
                  />
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  <input
                    name="description"
                    type="text"
                    placeholder="Write content here"
                    onChange={onChangeHandler}
                    value={data.description}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p>Start Day</p>
                </td>
                <td>
                  <input
                    type="datetime-local"
                    name="startDate"
                    onChange={onChangeHandler}
                    value={data.startDate}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <p>End Day</p>
                </td>
                <td>
                  <input
                    type="datetime-local"
                    name="endDate"
                    onChange={onChangeHandler}
                    value={data.endDate}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button className="add-btn" type="submit">
            Add
          </button>
        </form>
      </div>
      <div className="cover-right">
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddVoucher;
