import { useState } from "react";

export default function UploadForm({ onUpload, busy, uploadProgress }) {
  const [file, setFile] = useState(null);
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [tags,setTags]=useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

  if (!file) {
    alert("Please choose an image first.");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    alert("Only JPG, PNG, WebP, and GIF images are allowed.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("The image must be smaller than 5 MB.");
    return;
  }

  if (!title.trim()) {
    alert("Please enter a title for the photo.");
    return;
  }
  try {
    await onUpload({ file, title, description, tags });

    setFile(null);
    setTitle("");
    setDescription("");
    setTags("");
    e.target.reset();
  } catch {
    // Keep the form values so the user can retry.
  }
  };

  return (
    <form className="upload-bar" onSubmit={handleSubmit}>
      <input type="file" accept=".jpg,.jpeg,.png,.webp,.gif" onChange={(e) => setFile(e.target.files[0])} disabled={busy}/>
      <input type="text" placeholder="Title(REQUIRED)" value={title} onChange={(e)=>setTitle(e.target.value)} disabled={busy} maxLength={80} required />
      <input type="text" placeholder="Description(Optional)" value={description} onChange={(e)=>setDescription(e.target.value)} disabled={busy} maxLength={240}/>
      <input type="text" placeholder="Tags (comma separated ,max 5)"value={tags} onChange={(e)=>setTags(e.target.value)} disabled={busy} />
      <button type="submit" disabled={busy}>
        {busy ? `Uploading ${uploadProgress}%...` : "Upload"}
      </button>
    </form>
  );
}


// TODO (student extension): collect title, description, and tags and send them with the file.
