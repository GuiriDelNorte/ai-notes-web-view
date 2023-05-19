"use client"

import React, { useRef, useState, useEffect } from "react";
import ContentEditable from 'react-contenteditable'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import FeatherIcon from 'feather-icons-react';
import MenuButton from "@/components/buttons/MenuButton";

const placeholder = {
    noteId: "39490",
    title: "Note 2",
    notes: [
        {
            type: "text",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
    ]
} 


export default function Home() {

  const [notes, setNotes] = useState(placeholder.notes)
  const title = useRef(placeholder.title);

  const handleChange = evt => {
    title.current = evt.target.value;
  };

  const handleBlur = () => {
    console.log(title.current);
  };


  // Menu state
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleDrawer = () => {
    setMenuOpen(false)
    const message = { isMenuOpen: false };
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }

  // Avoid missync of menu bar in native view
  useEffect(() => {
    if (!isMenuOpen) {
      toggleDrawer()
    }
  }, [])


  useEffect(() => {
    const handleMessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.isMenuOpen) {
        setMenuOpen(true);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const addTextBlock = () => {
    let newTextBlock = {type: "text", text: ""}
    setNotes(prevState => [...prevState, newTextBlock])
    toggleDrawer()
  }

  const NoteComponent = ({ note, index }) => {

    const content = useRef(note.text);
    const blockRef = useRef();
    const [noteText, setNoteText] = useState(note.text)

    let componentToRender;
  
    switch (note.type) {
  
      case 'text':
      
        const handleChange = evt => {
          content.current = evt.target.value;
          setNoteText(evt.target.value)
        };
      
        const handleBlur = () => {
          console.log(content.current);
          // Save changes to DB
        };

        componentToRender = 
        <ContentEditable 
          ref={blockRef}
          placeholder="Write note..." 
          className="header text-base text-gray-800 mb-5" 
          style={{outline: 'none'}} 
          spellCheck="false" 
          html={content.current} 
          onBlur={handleBlur} 
          onChange={handleChange} 
        />
      break; 
    
      // Other note types
  
      default:
        componentToRender = <div>Invalid note type</div>;
    }
  
    return <div>{componentToRender}</div>;
  };

  return (
    <div className="h-screen pt-10 px-5">
      <ContentEditable placeholder="Untitled" className="header text-3xl font-bold mb-5" style={{outline: 'none'}} spellCheck="false" html={title.current} onBlur={handleBlur} onChange={handleChange} />
      
      {notes.map((note, index) => {
        return (
            <NoteComponent note={note} index={index} key={index}/>
        )
      })}

      <Drawer
          open={isMenuOpen}
          onClose={toggleDrawer}
          direction='bottom'
          className='bla bla bla'
          enableOverlay={false}
          size={180}
          duration={350}
      >
        <div onClick={toggleDrawer} className="px-3 pt-3 pb-6">
          <FeatherIcon icon="x" style={{color: '#adb5bd'}} />
        </div>
  
        <div className="px-3 pb-5 flex gap-5  overflow-x-scroll">
          
          <MenuButton icon={"edit"} text={"Text"} onClick={addTextBlock}/>
          <MenuButton icon={"list"} text={"List"} onClick={() => console.log("pressed")}/>
          <MenuButton icon={"check-circle"} text={"Todo"} onClick={() => console.log("pressed")}/>
          <MenuButton icon={"image"} text={"Image"} onClick={() => console.log("pressed")}/>
          <MenuButton icon={"paperclip"} text={"File"} onClick={() => console.log("pressed")}/>

        </div>

      </Drawer>

    </div>
  );
}