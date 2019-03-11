import React from 'react';
import logo from './logo.svg';
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import './App.css';

function EditButton(props) {
  return (
    <button
      key={props.cmd}
      onMouseDown={evt => {
        evt.preventDefault(); // Avoids loosing focus from the editable area
        document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
      }}
    >
      {props.name || props.cmd}
    </button>
  );
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      html: `<p>Hello <b>World</b> !</p><p>Paragraph 2</p>`,
      editable: true,
      x: null,
      y: null,
      visible: false,
      top: null,
      left: null,
      popVisible: false
    };
    this.timer = null;
  }

  onUpdate = e => {
    if (this.timer) {
      console.log(this.timer);
    }
    if (window.getSelection().focusNode.textContent === "") {
      document.execCommand("formatBlock", false, "p");
      console.log(this.timer);
      let dim = window.getSelection().focusNode.getBoundingClientRect();

      this.setState({
        x: dim.x,
        y: dim.top + window.scrollY,
        visible: true
      });
    } else {
      this.setState({ visible: false });
    }
  };

  componentDidMount() {
    document.addEventListener("mouseup", () => {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.getSelectionText();
      }, 0);
    });
    document.addEventListener("keyup", () => {
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.getSelectionText();
      }, 0);
    });
    //added delay since keyup will add div but we wont
    //have access to dimensions right away so i added
    //delay to keydown so it can wait to get dimensions
    //then add div
    document.addEventListener("keydown", () => {
      this.timer = setTimeout(e => {
        clearTimeout(this.timer);
        this.onUpdate(e);
      }, 0);
    });
    document.addEventListener("mousedown", () => {
      clearTimeout(this.timer);
      console.log(this.timer, " timer mousedown");
      this.timer = setTimeout(e => {
        this.onUpdate(e);
      }, 0);
    });
  }

  handleChange = evt => {
    this.setState({ html: evt.target.value });
  };

  sanitizeConf = {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "h1", "blockquote"],
    allowedAttributes: { a: ["href"], p: ["class", "tabindex"] }
  };

  sanitize = () => {
    this.setState({ html: sanitizeHtml(this.state.html, this.sanitizeConf) });
  };

  toggleEditable = () => {
    this.setState({ editable: !this.state.editable });
  };

  getSelectionText = () => {
    var text = "";
    text = window.getSelection();
    if (text.toString().length > 0) {
      let oRange = text.getRangeAt(0);
      let dim = oRange.getBoundingClientRect();
      this.setState({
        left: dim.left + dim.width / 2 - 293 / 2,
        top: dim.top - 51 + window.scrollY,
        popVisible: true
      });
    } else {
      this.setState({ popVisible: false });
    }
  };

  render = () => {
    return (
      <div>
        <h3>editable contents</h3>
        <ContentEditable
          className="editable"
          tagName="div"
          html={this.state.html} // innerHTML of the editable div
          disabled={!this.state.editable} // use true to disable edition
          onChange={this.handleChange} // handle innerHTML change
          //onBlur={this.sanitize}
          tabIndex="-1"
        />
        <h3>source</h3>
        <textarea
          className="editable"
          value={this.state.html}
          onChange={this.handleChange}
          onBlur={this.sanitize}
        />

        {this.state.visible && (
          <div
            ref={this.myRef}
            className="circlePopup"
            style={{
              position: "absolute",
              left: `${this.state.x - 40}px`,
              top: `${this.state.y - 7}px`
            }}
          >
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        )}
        {this.state.popVisible && (
          <div
            className="popup"
            style={{
              position: "absolute",
              left: `${this.state.left}px`,
              top: `${this.state.top}px`
            }}
          >
            {" "}
            <blockquote />
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
        )}
      </div>
    );
  };
}

export default App;
