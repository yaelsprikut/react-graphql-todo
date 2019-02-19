import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Post extends Component {
  render() {
    let title = this.props.post.title
    if (this.props.isDraft) {
      title = `${title} (Draft)`
    }

    return (
      <Link className="no-underline ma1" to={`/post/${this.props.post.id}`}>
        <li>
          <span class="label">{title}</span>
          <div class="actions">
            <button class="btn-picto" type="button">
              <i aria-hidden="true" class="material-icons">check_box_outline_blank</i>
            </button>
            <button class="btn-picto" type="button" aria-label="Delete" title="Delete">
              <i aria-hidden="true" class="material-icons">delete</i>
            </button>
          </div>
        </li>
      </Link>
    )
  }
}
