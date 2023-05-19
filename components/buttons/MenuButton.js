import React from 'react'
import FeatherIcon from 'feather-icons-react';


function MenuButton({icon, text, onClick}) {
  return (
    <div onClick={onClick} className="rounded-xl flex flex-col justify-center items-center px-8 py-5" style={{backgroundColor: '#F6F6F7'}}>
        <FeatherIcon className="mt-1" icon={icon} style={{color: '#6C757D'}} />
        <div className="text-xs text-center mt-2 font-semibold" style={{color: '#6C757D'}}>{text}</div>
    </div>
  )
}

export default MenuButton