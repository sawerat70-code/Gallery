import React, { useEffect } from "react";

export default function Viewer({ images, index, onClose, onChange, onDelete ,onToggleFavorite,onEdit}) {
  const prev = () => onChange((index - 1 + images.length) % images.length);
  const next = () => onChange((index + 1) % images.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onChange]);

  const image = images[index];

  return (
    <div className="overlay" onClick={onClose}>
      <div className="viewer" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>X</button>
        <button className="nav left" onClick={prev}>&#8249;</button>
        <img src={image.imageUrl} alt={image.title || "Viewer image"} />
        <button className="nav right" onClick={next}>&#8250;</button>
        <div className="viewer-details">
          <h3>{image.title || "Untitled image"}{""}
            <button className={`fav-btn ${image.isFavorite ? "active" :""}`}
            onClick={()=> onToggleFavorite(image._id, !image.isFavorite)}> ** </button>
          </h3>
          {image.description && <p>{image.description}</p>}
          {image.tags && image.tags.length >0 && (
           <div className="tags">
            {image.tags.map((t,i)=>(
              <span key={i} className="tag">
                #{t}
              </span>
            ))}
        </div>
          )}
          </div>
        <div className="viewer-footer">
          <span>Image {index + 1} of {images.length}</span>
          <div>
            <button 
            className="edit-btn" 
            onClick={()=>{onClose();
              onEdit(image);
            }}> Edit</button>
          <button className="delete" onClick={() => onDelete(image._id)}>Delete</button>
        </div>
      </div>
      </div>
    </div>
  );
}

// TODO (student extension): show metadata, favorite state, and an edit action in the viewer.
