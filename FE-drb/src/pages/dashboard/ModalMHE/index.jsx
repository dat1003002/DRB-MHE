import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

const MheModal = ({ open, handleOpen, data }) => {
  return (
    <Dialog 
      open={open} 
      onClose={handleOpen} 
      className="flex flex-col h-screen max-w-full"
      style={{ maxWidth: 'none', width: '100%', height: '100vh', background: 'white', borderRadius: '0px', margin: '0px' }}
    >
      <DialogHeader className="bg-[red] text-white text-3xl font-semibold flex justify-between items-center h-[50px]">
        <div className="flex items-center w-[20%]">
          <img src="/img/logo1.jpg" alt="Logo" className="mr-4" />
        </div>
        <div className="flex justify-center items-center w-[60%]">
          <p className="text-2xl sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold whitespace-nowrap">
            TIÊU CHUẨN CÔNG VIỆC
          </p>
        </div>
  <div className="w-[20%]"></div> 
      </DialogHeader>
      <DialogBody className="flex-grow justify-center items-center overflow-auto p-0">
        {data ? (
          <img 
            src={data.image} 
            alt="Product" 
            className="w-full h-auto object-contain"
          />
        ) : (
          <p>No data available</p>
        )}
      </DialogBody>
      <DialogFooter 
        className="flex justify-end bg-white border-t p-4 sm:p-6 flex-shrink-0"
        style={{ minHeight: '80px', height: 'auto' }}
      >
        <Button 
          className="bg-[red] w-[100px]" 
          color="black" 
          onClick={handleOpen}
        >
          <span className="text-base">Đóng</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default MheModal;
