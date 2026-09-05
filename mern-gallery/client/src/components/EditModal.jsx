import { useState } from "react";
export default function EditModal({ image, onClose, onSave}){
    const[title,setTitle]=useState(image.title || "");
    const [description,setDescription]=useState(image.description || "");
    const [tags,setTags]=useState(image.tags ? image.tags.join(","):"");
    const [saving,setSaving]=useState(false);

    const handleSubmit=async (e)=>{
e.preventDefault();
if(!title.trim()) return alert("Title is required");
setSaving(true);
try{
    await onSave(image._id,{title,description,tags});
    onClose();
}catch(err){
    alert("Failed to update: "+ err.message);
}finally{
    setSaving(false);
}
    };
     return (
    <div className="overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Image Details</h3>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={80}
          />

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={240}
          />

          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}