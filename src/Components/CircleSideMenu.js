import React from 'react';

const CircleSideMenu = (props) => {
  return (
    props.show && (
      <div
        className={`${props.className}`}
        style={{
          position: "absolute",
          left: `${props.x - 40}px`,
          top: `${props.y - 7}px`
        }}
      >
        <img src={props.logo} className="App-logo" alt="logo" />
      </div>
    )
  )
};

export default CircleSideMenu;
