export function saveImageToIndexedDB(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = () => {
      const dbRequest = indexedDB.open("ImageDB", 1);
  
      dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("images", { keyPath: "id" });
      };
  
      dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction("images", "readwrite");
        const store = transaction.objectStore("images");
        store.put({ id: "image", data: reader.result });
      };
    };
  }
  