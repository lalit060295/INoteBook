import React, { useState } from "react";
import noteContext from "./noteContext";
import { data } from "react-router-dom";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const initialNote = [];
  const [notes, setNotes] = useState(initialNote);

  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addNotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
          //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0MDI3N2IwNDJhMmI2OGU4YjMyNTc0In0sImlhdCI6MTczMjI1OTM0MH0.dvzsbL_--tKnX99Kp52g3aZixDlmZPZ0S7SARR0RhA4",
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const note = await response.json();
    setNotes(notes.concat(note));
  };

  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deleteNotes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
          //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0MDI3N2IwNDJhMmI2OGU4YjMyNTc0In0sImlhdCI6MTczMjI1OTM0MH0.dvzsbL_--tKnX99Kp52g3aZixDlmZPZ0S7SARR0RhA4",
      },
    });

    const json = await response.json();
    console.log(json);

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
          //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0MDI3N2IwNDJhMmI2OGU4YjMyNTc0In0sImlhdCI6MTczMjI1OTM0MH0.dvzsbL_--tKnX99Kp52g3aZixDlmZPZ0S7SARR0RhA4",
      },
    });

    const json = await response.json();
    setNotes(json);
  };

  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updateNotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
          //"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjc0MDI3N2IwNDJhMmI2OGU4YjMyNTc0In0sImlhdCI6MTczMjI1OTM0MH0.dvzsbL_--tKnX99Kp52g3aZixDlmZPZ0S7SARR0RhA4",
      },
      body: JSON.stringify({ title, description, tag }),
    });

    if (!response.ok) {
      console.error("API Error:", response.statusText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    console.log("API response:", json);

    //let newNotes = [...notes]; // Clone the current notes array
    let newNotes = JSON.parse(JSON.stringify(notes));

    //logic for edit
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        console.log(newNotes[index]);
        break;
      }
    }
    console.log(id);
    setNotes(newNotes);
  };

  return (
    <noteContext.Provider
      value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
