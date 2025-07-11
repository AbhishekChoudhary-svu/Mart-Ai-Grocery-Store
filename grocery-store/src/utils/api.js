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
     return res.data; // ✅ return only the data
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
     return res; // ✅ return only the data
    } catch (error) {
        console.log(error)
    }
}


