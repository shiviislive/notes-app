import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 🔹 Edit states
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // 🔹 Role
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data.notes);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllNotes = async () => {
    try {
      const res = await API.get("/notes/all");
      setNotes(res.data.notes);
    } catch (err) {
      console.log(err);
      alert("Admin access required");
    }
  };

  const createNote = async () => {
    if (!title || !content) {
      alert("Title and content required");
      return;
    }

    try {
      await API.post("/notes", { title, content });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/";
    } catch (err) {
      console.log(err);
    }
  };

  const updateNote = async (id) => {
    try {
      await API.put(`/notes/${id}`, {
        title: editTitle,
        content: editContent,
      });

      setEditId(null);
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* 🔹 Logout */}
      <button onClick={handleLogout} style={{ marginBottom: "10px" }}>
        Logout
      </button>

      {/* 🔹 Admin Button */}
      {role === "admin" && (
        <button
          onClick={fetchAllNotes}
          style={{ marginLeft: "10px", marginBottom: "15px" }}
        >
          View All Notes (Admin)
        </button>
      )}

      {/* 🔹 Create Note */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <input
          type="text"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br /><br />

        <button onClick={createNote}>Add Note</button>
      </div>

      {/* 🔹 Notes List */}
      {notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        notes.map((note) => (
          <div
            key={note._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{note.title}</h3>
            <p>{note.content}</p>

            {/* 🔥 Show user email if admin */}
            {note.user?.email && (
              <p>
                <b>User:</b> {note.user.email}
              </p>
            )}

            {/* 🔹 Actions */}
            <button onClick={() => deleteNote(note._id)}>Delete</button>

            <button
              onClick={() => {
                setEditId(note._id);
                setEditTitle(note.title);
                setEditContent(note.content);
              }}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>

            {/* 🔹 Edit Form */}
            {editId === note._id && (
              <div style={{ marginTop: "10px" }}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <br /><br />

                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <br /><br />

                <button onClick={() => updateNote(note._id)}>Save</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}