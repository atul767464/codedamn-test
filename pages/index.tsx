import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const MonacoEditor = dynamic(import("react-monaco-editor"), { ssr: false });
const DynamicTerminal = dynamic(() => import("../lib/Terminal"), {
  ssr: false
});
import debounce from 'lodash/debounce'
import axios from 'axios'

const Index = () => {
  const [code, setcode] = useState("");
  const [userName, setuserName] = useState("");
  const [language, setlanguage] = useState("typescript")
  const [auth, setAuth] = useState(null) as any
  const [error, seterror] = useState(false)
  const [loading, setloading] = useState(false)
  const handleLanguageChange =(e:any)=>{
     let  value = e.target.value
     setlanguage(value)
  }
  useEffect(() => {
    if(localStorage.getItem("userid")){
      setAuth(localStorage.getItem("userid"))
    }
   
    if(localStorage.getItem("userid")){
       saveTodb("get")
    }
   
  } ,[])
  const saveTodb = async (type="saveCode") => {
    const body = {
      userid: localStorage.getItem("userid"),
      type:type,
      code: code,
    };
    try {
      let res = await axios.post('/api/auth', body);
      setcode(res.data?.user?.code)
    } catch (error) {
      seterror(error.message);
    }
  };
  const handleCodeChange =(val :string)=>{
    setcode(val)
    // saveTodb("saveCode")
   let d =  debounce(saveTodb,2000 )
   d()
  }
  const handleAuth = async ()=>{
    const body ={
      type :"auth",
      code : code,
      userName : userName
    }
   try {
    setloading(true)
   let res =  await  axios.post('/api/auth' ,body )
   setAuth(true)
   localStorage.setItem("userid" , res.data?.user?._id)
   setcode(res.data?.user?.code)
   setloading(false)
   } catch (error) {
     console.log(JSON.stringify(error.response) ,"error")
     seterror(error?.response?.data?.message);
     setloading(false)
   }
  }
  if(!auth){
    return (
      <div className=" h-screen  bg-gray-500 flex flex-col justify-center items-center">
       
        <p className="text-gray-900 mb-2">Proceed To Play Ground</p>
        <input className="p-3" placeholder="Enter your user name" value={userName} type="text" onChange ={(e)=>setuserName(e.target.value)} />
        <div>
          <button className="bg-gray-900 text-white p-3 w-40 mt-3 rounded-sm" onClick={handleAuth}>continue</button>
        </div>
        {loading && <p>Loading...</p>}
      {error &&  <p className="text-red-500 p-3">{error}</p>} 
      </div>
    )
  }
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <h1 className="font-bold text-white text-center my-5 text-3xl bg-gray-900">
        Coding Is Fun
      </h1>
      <p className="text-center text-gray-900">Languages Supported</p>
      <p className="text-center my-5 text-gray-600 ">HTML | CSS | JAVASCRIPT | TYPESCRIPT | PYTHON</p>
      <p className="text-center my-5">Choose a language to start (by default typescript)</p>
     <div className="text-center mb-3 " >
     <select value={language} onChange={handleLanguageChange}>
        <option value="html">HTML</option>
        <option  value="css">CSS</option>
        <option  value="javascript">JAVASCRIPT</option>
        <option value="typescript" selected>TYPESCRIPT</option>
        <option  value="python">PYTHON</option>
      </select>
     </div>
      <div className="flex-1 py-12 px-10 bg-gray-100">
        <MonacoEditor
          editorDidMount={() => {
            // @ts-ignore
            window.MonacoEnvironment.getWorkerUrl = (
              _moduleId: string,
              label: string
            ) => {
              if (label === "json") return "_next/static/json.worker.js";
              if (label === "css") return "_next/static/css.worker.js";
              if (label === "html") return "_next/static/html.worker.js";
              if (label === "typescript" || label === "javascript")
                return "_next/static/ts.worker.js";
              return "_next/static/editor.worker.js";
            };
          }}
          width="1100"
          height="600"
          language={language}
          theme="vs-dark"
          value={code}
          options={{
            minimap: {
              enabled: false
            }
          }}
          onChange={handleCodeChange}

        />
      </div>
      <div className="" >
      <DynamicTerminal/>
      </div>
     
    </div>
  );
};

export default Index;
