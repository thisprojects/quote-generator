import React, { Component } from "react";

class AuthorAQuote extends Component {
  authorQuote = React.createRef();

  render() {
    return (
      <form
        onSubmit={event => {
          event.preventDefault();
          this.props.saveIt(this.authorQuote.current.value, "Yourself");
        }}
      >
        <label>
          <input
            type="text"
            ref={this.authorQuote}
            placeholder="Enter Your Quote"
          />
        </label>
        <input type="submit" value="Save Quote" />
      </form>
    ) || null;
  }
}

export default AuthorAQuote;
