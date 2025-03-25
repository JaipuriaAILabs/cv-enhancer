"use client"

import { useState, useEffect } from "react";
import Image from "next/image";

const ImageUploader = () => {
  const [image, setImage] = useState<string | null>(null);

  // Open or create IndexedDB database
  const openIndexedDB = (callback: (db: IDBDatabase) => void) => {
    const dbRequest = indexedDB.open("ImageDB", 1);

    dbRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "id" });
      }
    };

    dbRequest.onsuccess = (event: Event) => {
      callback((event.target as IDBOpenDBRequest).result);
    };

    dbRequest.onerror = (event: Event) => {
      console.error("IndexedDB error:", (event.target as IDBOpenDBRequest).error);
    };
  };

  // Save image to IndexedDB
  const saveImageToIndexedDB = (file: File | undefined) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      openIndexedDB((db) => {
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        const imageData = reader.result as string;
        store.put({ id: "image", data: imageData });
        setImage(imageData);
        // Dispatch a custom event to notify ResumeRenderer
        window.dispatchEvent(new CustomEvent('profileImageChanged', { detail: imageData }));
      });
    };
  };

  // Handle file input change
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      saveImageToIndexedDB(file);
    }
  };

  // Load image from IndexedDB on page load
  useEffect(() => {
    openIndexedDB((db) => {
      const transaction = db.transaction("images", "readonly");
      const store = transaction.objectStore("images");
      const getRequest = store.get("image");

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          setImage(getRequest.result.data);
        } else {
          // If no image exists in IndexedDB, initialize with placeholder
          initializeWithPlaceholder(db);
        }
      };
    });
  }, []);

  // Initialize with placeholder image
  const initializeWithPlaceholder = (db: IDBDatabase) => {
    fetch('/placeholder_pfp.png')
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => {
          const transaction = db.transaction("images", "readwrite");
          const store = transaction.objectStore("images");
          const imageData = reader.result as string;
          store.put({ id: "image", data: imageData });
          setImage(imageData);
        };
      });
  };

  return (
    <div className="mb-6">
      <label 
        htmlFor="profile-image-upload" 
        className="block cursor-pointer relative group"
      >
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#ef7f1a] transition-colors">
          <Image
            src={image || "/placeholder_pfp.png"}
            alt="Profile"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <span className="text-white text-sm">
                    
            <svg width="35" height="35" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </span>
          </div>
        </div>
        <input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default ImageUploader;
