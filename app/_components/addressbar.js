import React, { useEffect } from "react";

export default function AddressBar({ apiAddress, setApiAddress }) {
      const [newApiAddress, setNewApiAddress] = React.useState(apiAddress);
    
      useEffect(() => {
        setNewApiAddress(apiAddress); 
      }, [apiAddress]);
    
      const handleBlur = () => {
        setApiAddress(newApiAddress);
        console.log("New API Address: ", newApiAddress);
      };
    
      const handleInputChange = (e) => {
        setNewApiAddress(e.target.value); 
      };

    return (
        <div className="flex flex-row items-center justify-center mb-4  w-full">
            <span className="ml-10 text-lg">Address:</span>
            <input
                className="border-2 border-gray-400 rounded-md w-full mx-5"
            onChange={handleInputChange} 
            onBlur={handleBlur}
          value={newApiAddress} 
        />
      </div>
    )
}