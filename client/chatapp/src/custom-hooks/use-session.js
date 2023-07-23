import { useState, useEffect } from "react";

export const useSession = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = sessionStorage.getItem(key);
    const parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;
    return parsedValue;
  });

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.storageArea === sessionStorage && event.key === key) {
        console.log("useSessionStorage: storage change", event.newValue);

        setValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  const updateSession = (newValue) => {
    setValue(newValue);
    const newData = JSON.stringify(newValue);
    console.log(newData, newValue);
    sessionStorage.setItem(key, newData);

    //dispatch event to notify other components
    const storageEvent = new StorageEvent("storage", {
      key,
      newValue: newData,
      storageArea: sessionStorage,
    });
    window.dispatchEvent(storageEvent);
  };

  return [value, updateSession];
};
