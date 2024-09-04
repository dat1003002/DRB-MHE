import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { BookmarkSquareIcon, XCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";

const AddMhe = ({ open, handleOpen }) => {
    const initialFormData = {
        name: "",
        description: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files) {
            setSelectedImage(files[0]);
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSave = async () => {
        if (!formData.name || !selectedImage || !formData.description) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('image', selectedImage);

            console.log("Dữ liệu gửi đi:", formDataToSend); // Logging formData

            await axios.post("http://192.168.3.148:5001/api/data", formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Dữ liệu đã được lưu thành công.");
            setFormData(initialFormData);
            setSelectedImage(null);
            handleOpen();
            alert("Dữ liệu được thêm thành công!");
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Đã xảy ra lỗi khi thêm dữ liệu.");
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} style={{ maxWidth: '50%', width: 'auto' }}>
            <DialogHeader className="bg-red-600 text-white text-center py-4">
                Thêm Mới Tiêu Chuẩn Công Việc
            </DialogHeader>
            <DialogBody className="p-6">
                <form>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <label className="w-1/3 text-black font-medium text-base">Tên Tiêu Chuẩn:</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                className="border border-gray-300 p-2 w-2/3 text-black rounded-md"
                            />
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-black font-medium text-base">Ảnh Tiêu Chuẩn:</label>
                            <input 
                                type="file" 
                                name="image" 
                                accept="image/*"
                                onChange={handleChange} 
                                className="border border-gray-300 p-2 w-2/3 text-black rounded-md"
                            />
                            {selectedImage && (
                                <p className="mt-2 text-black">Ảnh đã chọn: {selectedImage.name}</p>
                            )}
                        </div>
                        <div className="flex items-center">
                            <label className="w-1/3 text-black font-medium text-base">Mô Tả:</label>
                            <input 
                                type="text" 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                className="border border-gray-300 p-2 w-2/3 text-black rounded-md"
                            />
                        </div>
                    </div>
                </form>
            </DialogBody>
            <DialogFooter className="flex justify-end p-4">
                <Button 
                    variant="gradient" 
                    color="blue" 
                    className="flex items-center space-x-2 text-white mr-1"
                    onClick={handleSave}
                >
                    <BookmarkSquareIcon className="w-5 h-5" />
                    <span>Lưu</span>
                </Button>
                <Button 
                    variant="gradient" 
                    color="red" 
                    className="flex items-center space-x-2 text-white"
                    onClick={handleOpen}
                >
                    <XCircleIcon className="w-5 h-5" />
                    <span>Đóng</span>
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default AddMhe;
