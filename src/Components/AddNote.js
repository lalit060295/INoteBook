import React, { useContext, useState } from "react";
import NoteContext from "../context/notes/noteContext";

const AddNote = () => {
  const context = useContext(NoteContext);
  const { addNote } = context;

  const [notes, setNotes] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(notes.title, notes.description, notes.tag);
    setNotes({ title: "",description: "", tag: ""})
  };

  const onChange = (e) => {
    setNotes({ ...notes, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <div className="container my-3">
        <h1>Add a note</h1>
        <form className="container my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
               value={notes.title}
              onChange={onChange}
              minLength={5} required
              aria-describedby="emailHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
               value={notes.description}
              minLength={5} required
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              minLength={5} required value={notes.tag}
              onChange={onChange}
            />
          </div>
          <button
            type="Add a note"
            className="btn btn-primary"
            onClick={handleClick}
            disabled={notes.title.length < 3 || notes.description.length < 3}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
