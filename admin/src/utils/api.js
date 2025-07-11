import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL;


export async function postData(url,formData) {
    try {
        const response = await fetch(apiUrl +url ,{
            method: "POST",
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                 "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }) 

        if (response.ok){
            const data =await response.json()
            return data
        }else{
            const errorData = await response.json()
            return errorData
        }
        
    } catch (error) {
        console.log(error)
    }
    
}


export async function fetchDataFromApi (url){
    try {
        const params = {
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                 "Content-Type": "application/json",
            },
        }

        const {data}= await axios.get(apiUrl + url ,params)
        return data; 
    } catch (error) {
        console.log(error)
        return error;
    }
}
 

export async function uploadAvatarImage (url,updatedData){
    try {
        const params = {
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                 "Content-Type": "multipart/form-data",
            },
        }
        var response;
     await axios.put(apiUrl+ url,updatedData,params).then((res)=>{
        response=res
    })
    return response;
    } catch (error) {
        console.log(error)
    }
}

export async function editData (url,updatedData){
    try {
        const params = {
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                 "Content-Type": "application/json",
            },
        }
        
    const res= await axios.put(apiUrl+ url,updatedData,params)
     return res.data; 
    } catch (error) {
        console.log(error)
    }
}



export async function deleteData (url){
    try {
        const params = {
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                 "Content-Type": "application/json",
            },
        }
        
    const res= await axios.delete(apiUrl+ url,params)
     return res; 
    } catch (error) {
        console.log(error)
    }
}

export async function deleteMultipleData(url, ids) {
  try {
    const res = await axios.delete(
      apiUrl + url,
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        data: { ids },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting multiple data:", error);
    throw error;
  }
}



export async function uploadAdminImages (url,formData){
    try {
        const params = {
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                 "Content-Type": "multipart/form-data",
            },
        }
        var response;
     await axios.post(apiUrl+ url,formData,params).then((res)=>{
        response=res
    })
    return response;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteImages (url ){
    try {
        const param = {
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                   "Content-Type": "application/json",
            },
        }
        
    const res= await axios.delete(apiUrl+ url,param)
     return res;
    } catch (error) {
        console.log(error)
    }
}


