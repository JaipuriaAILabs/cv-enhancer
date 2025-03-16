import React from 'react'

interface HomeProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  loading: boolean;
  file: File | null;
}

const Home = ({handleFileChange, handleUpload, loading, file}: HomeProps) => {
  return (
    <>  
    <div className="flex justify-center items-center h-screen max-w-[50vw] mx-auto col-span-2">
      <div className="flex flex-col items-center">
        
        <label htmlFor="file-upload" className={`items-center justify-center mx-auto mb-4 w-[360px] h-[512px] cursor-pointer  rounded-md  duration-200 text-white font-bold py-2 px-4 flex-col flex gap-4 group ${file==null ? "bg-black/50" : "bg-black"}`}>
        {
          !file ? (
            <div className=' items-center flex flex-col'>
            <svg className="group-hover:-translate-y-4 duration-200" width="60" height="60" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            <p>(click to upload a .pdf)</p>
            </div>
          ):
          (
            <div className=' items-center flex flex-col'>
              <p>{file.name}</p>
            </div>
          )
        }
       
        </label>
        <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        <button onClick={handleUpload} disabled={loading || !file} className={`rounded-full  duration-200 mt-4 text-white font-bold py-2 px-4  disabled:opacity-50 ${loading ? "bg-gray-400" : "bg-black"}`}>
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </div>
    </div>
    </>
  )
}

export default Home