import React from 'react';
import EditButton from './EditButton.js'

const PopOver = (props) => {
  return (
     props.show && (
       <div style={{
        position: "absolute",
        left: `${props.left}px`,
        top: `${props.top}px`
      }}>
        <EditButton cmd="formatBlock" arg="p" name="paragraph" />
        <EditButton cmd="bold" arg="null" name="Bold" />
        <EditButton cmd="formatBlock" arg="h1" name="heading" />
        <EditButton cmd="formatBlock" arg="blockquote" name="blockquote" />
        <EditButton
          cmd="createLink"
          arg="https://github.com/lovasoa/react-contenteditable"
          name="hyperlink"
        />
      </div>
    )
  )
};


export default PopOver;
