import React from 'react';
import logo from './logo.svg';
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import './App.css';
import PopOver from './Components/PopOver.js'
import CircleSideMenu from './Components/CircleSideMenu.js'

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      html: ``,
      editable: true,
      x: null,
      y: null,
      visible: false,
      top: null,
      left: null,
      popVisible: false
    };
    this.timer = null;
    this.contentEditable = React.createRef();
  }

  handleEvent = (e) => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      var text = "";
      text = window.getSelection();
      let start = text.anchorNode;
      let end = text.focusNode;
      console.log(start, '=====start======')
      console.log(end, '=====end======')
      console.log(start.isSameNode(end))
      if (e.key==="Backspace" && this.state.html === "") {
        document.execCommand("formatBlock", false, "p");
      }

      if (text.toString().length > 0 && start.isSameNode(end) && e.type==="mouseup" ) {
        let oRange = text.getRangeAt(0);
        let dim = oRange.getBoundingClientRect();
        this.setState({
          left: dim.left + dim.width / 2 - 293 / 2,
          top: dim.top - 51 + window.scrollY,
          popVisible: true
        });
      } else if ((e.type==='mouseup' || e.key==="Backspace") &&  text.isCollapsed){
        this.setState({ popVisible: false });
      }
      // console.log(text, '=====text======')
      // console.log(text.anchorNode.nodeType, '=====nodetype======')
      // console.log(text.isCollapsed, '=====collapse======')
      if (text.anchorNode.nodeType !== 3 && text.isCollapsed ) {
        let dim = window.getSelection().focusNode.getBoundingClientRect();
        console.log(text.isCollapsed, '======text collapase====')
        this.setState({
          x: dim.x,
          y: dim.top + window.scrollY,
          visible: true
        });
      } else if (window.getSelection().focusNode.textContent !== "" && (e.type==="keydown" ||e.type==="mousedown") ){
        this.setState({ visible: false });

      }

      if (e.key==="Enter") {
        document.execCommand("formatBlock", false, "p");
        let dim = window.getSelection().focusNode.getBoundingClientRect();
        this.setState({
          x: dim.x,
          y: dim.top + window.scrollY,
          visible: true
        });
      }
    }, 0);
  }

  componentDidMount() {
    document.getElementsByClassName("editable")[0].focus()
    document.execCommand("formatBlock", false, "p");

    let dim = window.getSelection().focusNode.getBoundingClientRect();
    this.setState({
      x: dim.x,
      y: dim.top + window.scrollY,
      visible: true
    });

    this.contentEditable.current.addEventListener('mouseup', this)
    this.contentEditable.current.addEventListener('mousedown', this)
    this.contentEditable.current.addEventListener('keydown', this)

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

  render = () => {
    return (
      <div>
        <h3>editable contents</h3>
        <ContentEditable
          id="parent"
          innerRef={this.contentEditable}
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
          <CircleSideMenu logo={logo} className={"circlePopup"} x={this.state.x} y={this.state.y} show={this.state.visible}/>

          <PopOver top={this.state.top} left={this.state.left} show={this.state.popVisible}/>
      </div>
    );
  };
}

export default App;
