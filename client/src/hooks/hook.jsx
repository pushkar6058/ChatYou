import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};


const useAsyncMutation=(mutationHook)=>{

  const [isLoading,setIsLoading]=useState(false);
  const [data,setData]=useState(null);
  const [mutate]=mutationHook();

  const executeMutation=async(toastMsg,...args)=>{
    setIsLoading(true);
    const toastId=toast.loading(toastMsg || "Updating");

    try {
      const res= await mutate(...args);
      if(res.data){
        toast.success(res?.data?.message || "Data updated successfully",{id:toastId}); 
        setData(res.data);
      }
      else{ 
        toast.error(res?.error?.data?.message || "Something went wrong",{id:toastId})
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong",{id:toastId});
    }
    finally{
      setIsLoading(false);
    }
  }

  return [executeMutation,isLoading,data];
  
}




const useSocketEvents = (socket, handlers = {}) => {
  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') {
      console.log(socket);
      console.warn("Invalid socket instance");
      return;
    }

    if (!handlers || typeof handlers !== 'object') {
      console.warn("Handlers must be a non-null object:", handlers);
      return;
    }

    // Register all handlers
    Object.entries(handlers).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        socket.on(event, handler);
      } else {
        console.warn(`Handler for event "${event}" is not a function`);
      }
    });

    // Cleanup on unmount
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        if (typeof handler === 'function') {
          socket.off(event, handler);
        }
      });
    };
  }, [socket, handlers]);
};


export { useErrors ,useAsyncMutation,useSocketEvents};
