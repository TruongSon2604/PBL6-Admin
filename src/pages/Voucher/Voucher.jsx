import React, { useEffect, useState } from "react";
import "../Combo/Combo.css";
import axios from "axios";
import LoadingSpinner from "../../Action/LoadingSpiner.js";
import ModalComponent from "../../components/ModalComponent.js";
import Example from "../../components/ModalComponent.js";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { faForward } from "@fortawesome/free-solid-svg-icons";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Load from "../../components/Load/Load.jsx";

const Voucher = ({ url }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái lưu từ khóa tìm kiếm
  const itemsPerPage = 4; // Số lượng phần tử mỗi trang
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${url}/api/v1/public/voucher/all`);
        setData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // delete store
  const deleteComboid = async (comboId) => {
    try {
      const tk = localStorage.getItem("access_token");
      const headers = {
        Authorization: `Bearer ${tk}`,
        "Content-Type": "application/json",
      };
      await axios.delete(`${url}/api/v1/admin/combo/delete/${comboId}`, {
        headers,
      });
      setData(data.filter((cat) => cat.comboId !== comboId));
      toast.success("Deleted Comboid Successful");
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


  if (loading) {
    return (
      <p>
        <Load />
      </p>
    );
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Xử lý từ khóa tìm kiếm
  const filteredData = data.filter((item) =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xác định các phần tử cần hiển thị trên trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Tính toán số trang
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="product">
      <div className="content">
        <div
          className="heading"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 className="h-product">List Voucher</h1>
          <div className="store-search">
            <input
              type="text"
              placeholder="Search Voucher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "5px 15px",
                outlineColor: "tomato",
              }}
            />
          </div>
        </div>
        <table
          className="table table-hover text-center align-items-center tb-product"
          style={{
            backgroundColor: "red",
            tableLayout: "fixed",
            textAlign: "center",
            verticalAlign: "center",
            boxShadow: "0 0.1rem 0.4rem #0002",
          }}
        >
          <thead
            className="table-danger text-center"
            style={{
              whiteSpace: "nowrap",
              textAlign: "center",
              verticalAlign: "center",
            }}
          >
            <tr>
              <th scope="col" style={{ width: "10%" }}>
              voucherId
              </th>
              <th scope="col">code</th>
              <th scope="col">discountPercent</th>

              <th scope="col">description</th>
              <th scope="col">startDate</th>
              <th scope="col">endDate</th>
              {/* <th scope="col">Food</th> */}
              {/* <th scope="col">Action</th> */}
            </tr>
          </thead>
          <tbody className="align-middle">
            {currentItems.length > 0 ? (
              currentItems.map((data) => (
                <tr
                  key={data.comboId}
                  style={{ borderBottom: "2px solid rgb(228, 223, 223)" }}
                >
                  <td>{data.voucherId}</td>
                  <td>{data.code}</td>
                  <td>{data.discountPercent}</td>

                  <td>{data.description}</td>
                  <td>{data.startDate}</td>

                  <td>{data.endDate}</td>
                  {/* <td>A</td> */}
                  {/* <td>
                  
                    <button
                      style={{
                        border: "2px solid gray",

                        borderRadius: "50%",
                      }}
                      className="btndelete"
                      onClick={() => deleteComboid(data.voucherId)}
                    >
                      <IconButton aria-label="delete" size="medium">
                        <DeleteIcon />
                      </IconButton>
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        <div
          className="pagination pagenigate-pd pd"
          style={{ marginTop: "80px" }}
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faBackward} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faForward} />
          </button>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Voucher;
