import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import axios from 'axios';

const EditMhe = ({ open, handleOpen, item }) => {
    const [formValues, setFormValues] = useState({
        name: "",
        image: null,
        description: "",
    });

    useEffect(() => {
        if (item) {
            setFormValues({
                name: item.name || "",
                image: null, // Không cần lấy ảnh từ item, sẽ xử lý upload ảnh mới nếu có
                description: item.description || "",
            });
        }
    }, [item]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormValues({ ...formValues, image: file });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', formValues.name);
        formData.append('description', formValues.description);
        if (formValues.image) {
            formData.append('image', formValues.image);
        }

        axios.put(`http://192.168.3.148:5001/api/data/${item.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            handleOpen();
        })
        .catch(error => {
            console.error("Error updating data:", error);
        });
    };

    return (
        <Dialog open={open} handler={handleOpen} style={{ maxWidth: 'none', width: '55%' }}>
            <DialogHeader className="flex justify-center bg-red-500 text-white">CHỈNH SỬA QUY CÁCH</DialogHeader>
            <DialogBody>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label className="w-1/3 text-black font-medium text-base">Tên Tiêu Chuẩn:</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formValues.name}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-2/3 text-black rounded-md"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-black font-medium text-base">Ảnh Tiêu Chuẩn:</label>
                            <input 
                                type="file" 
                                name="image" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="border border-gray-300 p-2 w-2/3 text-black rounded-md"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-black font-medium text-base">Mô Tả:</label>
                            <input 
                                type="text" 
                                name="description" 
                                value={formValues.description}
                                onChange={handleInputChange}
                                className="border border-gray-300 p-2 w-2/3 text-black rounded-md"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" variant="gradient" 
                    color="blue" 
                    className="flex items-center space-x-2 text-white mr-1">Lưu</Button>
                        <Button   variant="gradient" 
                    color="red" 
                    className="flex items-center space-x-2 text-white" onClick={() => handleOpen()}>Hủy</Button>
                    </DialogFooter>
                </form>
            </DialogBody>
        </Dialog>
    );
};

export default EditMhe;
