import React, { useState, useEffect } from "react";
import { Input, Button } from "@material-tailwind/react";
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AddMhe from "./ModalMHE/addmhe";
import MheModal from "./ModalMHE";
import EditMhe from "./ModalMHE/Editmhe";
import { EyeIcon, PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

function Home() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userRole, setUserRole] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      // Đặt currentPage về 1 khi tìm kiếm
      setCurrentPage(1);
      setData(allData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
    } else {
      const filteredData = allData.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      setData(filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      // Đặt currentPage về 1 khi tìm kiếm
      setCurrentPage(1);
    }
  }, [searchTerm, allData]);
  
  useEffect(() => {
    const fetchDataForPage = () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setData(allData.slice(startIndex, endIndex));
    };
  
    fetchDataForPage();
  }, [currentPage, allData]);
  
  useEffect(() => {
    const fetchDataForPage = () => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setData(allData.slice(startIndex, endIndex));
    };

    fetchDataForPage();
  }, [currentPage, allData, itemsPerPage]);

  const fetchData = () => {
    axios.get('http://192.168.3.148:5001/data')
      .then(response => {
        console.log("danh sách list", response.data);
        
        setAllData(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        setCurrentPage(1);
  
        // Cập nhật data cho trang hiện tại
        const startIndex = 0;
        const endIndex = itemsPerPage;
        setData(response.data.slice(startIndex, endIndex));
      })
      .catch(error => {
        console.error('Có lỗi xảy ra khi tải dữ liệu!', error);
      });
  };
  
  const handleSave = (formData) => {
    console.log("Dữ liệu gửi lên server:", formData);
  
    axios.post("http://192.168.3.148:5001/api/data", formData)
      .then(response => {
        console.log("Dữ liệu mới thêm từ server:", response.data);
  
        const newData = response.data;
  
        setAllData(prevData => {
          const updatedData = [newData, ...prevData];
          
          // Tính toán lại tổng số trang
          setTotalPages(Math.ceil(updatedData.length / itemsPerPage));
          
          // Cập nhật data cho trang hiện tại
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const newDataForPage = updatedData.slice(startIndex, endIndex);
          setData(newDataForPage);
          
          console.log("Dữ liệu sau khi cập nhật:", updatedData);
          console.log("Dữ liệu hiển thị cho trang hiện tại:", newDataForPage);
          return updatedData;
        });
        
        setOpenAddDialog(false);
      })
      .catch(error => {
        console.error("Lỗi khi lưu dữ liệu:", error);
      });
  };
  

  const handleDelete = (id) => {
    confirmAlert({
      message: 'Bạn có chắc chắn muốn xóa không ?',
      buttons: [
        {
          label: 'Xóa',
          onClick: () => {
            axios.delete(`http://192.168.3.148:5001/api/data/${id}`)
              .then(response => {
                fetchData();
              })
              .catch(error => {
                console.error("Lỗi khi xóa dữ liệu:", error);
              });
          }
        },
        {
          label: 'Đóng',
          onClick: () => {}
        }
      ]
    });
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleEdit = (id) => {
    setEditItemId(id);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditItemId(null);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <>
      <div className="flex mt-4">
        <div className="ml-auto md:mr-4 md:w-72">
          <Input 
            label="Tìm kiếm tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-2 mt-3 p-4">
        {data.map((item) => (
          <div key={item.id} className="w-1/3 mb-4 relative group p-2">
            <div className="card bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full border-2 border-black rounded h-[100%] flex flex-col">
  <div className="relative flex-grow flex items-center justify-center">
    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-cover" />
    {userRole === "admin" ? (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button                 
          className="bg-[#5bc0de] text-white px-2 py-1 m-1 rounded"
          onClick={() => handleOpenModal(item)}
        >
          <EyeIcon className="h-5 w-5 text-white" />
        </button>
        <button
          className="bg-[#337ab7] text-white px-2 py-1 m-1 rounded"
          onClick={() => setOpenAddDialog(true)}
        >
          <PlusCircleIcon className="h-5 w-5 text-white" />
        </button>
        <button
          className="bg-[#87B87F] text-white px-2 py-1 m-1 rounded"
          onClick={() => handleEdit(item)}
        >
          <PencilSquareIcon className="h-5 w-5 text-white" />
        </button>
        <button
          className="bg-[#D15B47] text-white px-2 py-1 m-1 rounded"
          onClick={() => handleDelete(item.id)}
        >
          <TrashIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    ) : (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          className="bg-[#5bc0de] text-white px-2 py-1 m-1 rounded"
          onClick={() => handleOpenModal(item)}
        >
          <EyeIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    )}
  </div>
  <div
    className="container p-2 bg-gray-200 cursor-pointer flex items-center justify-center h-[50px]"
    onClick={() => handleOpenModal(item)}
  >
    <h4 className="text-sm text-[#3f51b5]] font-bold text-center">
      {item.name}
    </h4>
  </div>
</div>


      </div>
  ))}
      </div>
      {selectedItem && (
        <MheModal open={!!selectedItem} data={selectedItem} handleOpen={handleCloseModal} />
      )}

      <AddMhe open={openAddDialog} handleOpen={() => setOpenAddDialog(false)} handleSave={handleSave} />
      <EditMhe open={editModalOpen} handleOpen={handleCloseEditModal} item={editItemId} />

      <div className="mt-4 flex justify-end">
        <Button
          className="rounded-none text-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trước
        </Button>
        {renderPageNumbers().map(page => (
          <Button
            key={page}
            className={`rounded-none bg-white border border-black text-black ${
              currentPage === page ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          className="rounded-none"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Sau
        </Button>
      </div>
    </>
  );  
}

export default Home;
