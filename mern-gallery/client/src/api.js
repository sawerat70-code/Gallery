import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const getImages=(params={})=>{
  const queryParams=new URLSearchParams();
  if(params.search) queryParams.append("search", params.search);
  if(params.favorite) queryParams.append("favorite","true");
  if(params.sort) queryParams.append("sort", params.sort);
  
  return axios.get(`${API}/images?${queryParams.toString()}`).then((r) => r.data);
};


export const deleteImage = (id) => axios.delete(`${API}/images/${id}`).then((r) => r.data);
// Send the actual file to our own server as multipart/form-data.
// The server saves it into /uploads, builds the URL, and stores only that URL in MongoDB.
export const uploadImage = ({file, title, description, tags},onUploadProgress) => {
  const form = new FormData();
  form.append("image", file);
  form.append("title",title);
  if (description) form.append("description", description);
  if (tags) form.append("tags", tags);
return axios
  .post(`${API}/images`, form, { onUploadProgress })
  .then((r) => r.data);
};
export const updateImage=(id,{title,description,tags})=>{
  return axios.patch(`${API}/images/${id}`,{title,description,tags}).then((r)=>r.data);
};
export const toggleFavorite=(id,isFavorite)=>{
  return axios.patch(`${API}/images/${id}/favorite`,{isFavorite}).then((r)=>r.data);
}

// TODO (student extension): add query parameters to getImages for search, favorite, and sort.
// TODO (student extension): add updateImage and toggleFavorite PATCH helpers.
