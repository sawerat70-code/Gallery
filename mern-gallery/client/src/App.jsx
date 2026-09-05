import { useEffect, useState,useCallback, useRef } from "react";
import { getImages, deleteImage, uploadImage, updateImage,toggleFavorite} from "./api";
import UploadForm from "./components/UploadForm";
import Gallery from "./components/Gallery";
import Viewer from "./components/Viewer";
import EditModal from"./components/EditModal";


export default function App() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(null); // index of the open image
  const [busy, setBusy] = useState(false);
  const [loading ,setLoading]=useState(true);
  const [error,setError]=useState(null);

  const [search,setSearch]=useState("");
  const [favoriteFilter,setFavoriteFilter]=useState(false);
  const [sort,setSort]=useState("recent");

  const [editingImage,setEditingImage]=useState(null);
  const loadRequest=useRef(0);
  const load =useCallback(async ()=>{
  const requestId=++loadRequest.current;
  setLoading(true);
  setError(null);
    try{
      const data=await getImages({
        search,
        favorite:favoriteFilter,
        sort,
      });
     if(requestId===loadRequest.current){
      setImages(data);
     }
}catch(err){
  if(requestId===loadRequest.current){
    setError("We couldn't load your gallery.Please check your connection");
  }
}finally{
  if(requestId===loadRequest.current){
    setLoading(false);
  }
}
}, [search,favoriteFilter,sort]);

  useEffect(()=>{
    load();
  }, [load]);

  useEffect(()=>{
    if(current !== null && current >=images.length){
      setCurrent(null);
    }
  }, [current ,images.length]);
const[uploadProgress, setUploadProgress]=useState(0);
  
const handleUpload = async (uploadData) => {
  setBusy(true);
  setUploadProgress(0);

  try {
    await uploadImage(uploadData, (event) => {
      if (event.total) {
        setUploadProgress(Math.round((event.loaded * 100) / event.total));
      }
    });
    await load();
  } catch (err) {
    const message = err.response?.data?.message || err.message;
    setError(`Upload failed: ${message}`);
    throw err;
  } finally {
    setBusy(false);
    setUploadProgress(0);
  }
};

  // TODO (student extension): connect metadata fields, search/filter/sort controls,
  // favorite updates, edit metadata, and loading/error/empty states here.
  const handleToggleFavorite=async(id,isFavorite)=>{
    try{
      const updated=await toggleFavorite(id,isFavorite);
      setImages((prev)=>
      prev.map((img)=>(img._id===id? updated : img))
    );
    if(favoriteFilter && !isFavorite){
      load();
    }
    }catch(err){
      setError(`Favorite update failed: ${err.message}`);
    }
  };

  const handleEditSave=async (id, updatedFields)=>{
    const updated=await updateImage(id,updatedFields);
    setImages((prev)=> prev.map((img)=>(img._id===id ? updated : img)));
    await load();
  };

 const handleDelete=async (id)=>{
  if(!confirm("Delete this image?")) return;
  try{
    await deleteImage(id);
    setCurrent(null);
    setImages((prev)=>prev.filter((img)=>img._id !==id));
  }catch(err){
    setError(`Delete failed: ${err.message}`);
  }
 };
  return (
    <div className="app">
      <header>
        <h1>MERN Gallery</h1>
        <span>{images.length} images</span>
      </header>

      <UploadForm onUpload={handleUpload} busy={busy} uploadProgress={uploadProgress} />

      <div className="controls-bar">
        <input 
        type="text"
        placeholder="Search by title,description or tags..."
        value={search}
        onChange={(e)=> setSearch(e.target.value)}
        className="search-input"
        />
        <button 
        className={`filter-btn ${favoriteFilter ? "active" :""}`}
        onClick={()=> setFavoriteFilter(!favoriteFilter)}
      >
        {favoriteFilter ? "** Favorites" : "** favorites"}
      </button>
      <select
      value={sort}
      onChange={(e)=> setSort(e.target.value)}
      className="sort-select"
      >
         <option value="recent">Most recent</option>
        <option value="oldest">Oldest first</option>
      </select>
      </div>
      {loading ? (
        <div className="loading-state">
          <p> Loading your gallery....</p>
          </div>
      ) : error ? (
        <div className="error-card">
          <p>{error}</p>
          <button onClick={load}>Retry request</button>
          </div>
      ) :(
<Gallery images={images} onOpen={setCurrent} onDelete={handleDelete} onToggleFavorite={handleToggleFavorite}
onEdit={(img)=> setEditingImage(img)} 
isFiltered={Boolean(search || favoriteFilter)}
/>

      )}
      
      {current !== null && (
        <Viewer
          images={images}
          index={current}
          onClose={() => setCurrent(null)}
          onChange={setCurrent}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onEdit={(img)=>setEditingImage(img)}
        />
      )}
      {editingImage && (
        <EditModal 
        image={editingImage}
        onClose={()=> setEditingImage(null)}
        onSave={handleEditSave}
        />
      )}
    </div>
  );
}
