export default function Gallery({ images, onOpen, onDelete,onToggleFavorite,onEdit,isFiltered }) {
  if(!images.length){
    if(isFiltered){
      return (
        <div className="empty">
          <h3>No photos found</h3>
          <p>Try matching another search term or clearing your filters,</p>
        </div>
      );
    }
    return <div className="empty">No images yet.Upload your first photo!!</div>;
  }
  return (
    <div className="grid">
      {images.map((img, i) => (
        <div className="card" key={img._id}>
          <button className={`fav-btn ${img.isFavorite ?"active":""}`}
          onClick={()=>onToggleFavorite(img._id, !img.isFavorite)}
          aria-label="Favorite"> ★ </button>

          <img src={img.imageUrl} alt={img.title || "Gallery item"} onClick={() => onOpen(i)} />

          <div className="card-info">
            <h4>{img.title || "Untitled image"}</h4>
            {img.description && <p className="desc"> {img.description}</p>}
            {img.tags && img.tags.length>0 && (
              <div className="tags">
              {img.tags.map((tag,idx)=>(
                <span key={idx} className="tag">
                  #{tag}
                </span>
              ))}
              </div>
            )}
            <div className="card-actions">
          <button className="edit-btn" onClick={()=>onEdit(img)}>EDIT</button>
            </div>
          <button className="delete" onClick={() => onDelete(img._id)}>Delete</button>
        </div>
        </div>
      ))}
    </div>
  );
}

// TODO (student extension): show metadata, favorite controls, edit action, and
// separate no-results UI when filters return no images.
