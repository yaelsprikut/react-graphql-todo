import React, { Component, Fragment } from 'react'
import { Query, Mutation } from 'react-apollo'
import { withRouter, Link } from 'react-router-dom'
import  { gql } from 'apollo-boost'
import { DRAFTS_QUERY } from './DraftsPage'
import { FEED_QUERY } from './FeedPage'

export default class Post extends Component {
  render() {
    console.log('Post.Js props', this.props);
    console.log(this._renderAction(this.props.post.id));
    let action = this._renderAction(this.props.post);
    let title = this.props.post.title
    let content = this.props.post.content
    let isPending = '';
    if(this.props.post.published === false) {
      isPending = "Pending"
    } else {
      isPending = "Completed"
    }
    if (this.props.isDraft) {
      title = `${title} (Draft)`
    }

    return (
      <Link className="no-underline ma1" to={`/post/${this.props.post.id}`}>
        <li>
          <span className="label">{title}<hr /><br />
          <span className="smalldescription">
          Description: {content}<br/>
          Status: {isPending}<br/>
          Due Date:<br/>
          Category:
          </span>
          </span>
          <div className="actions">
            <button className="btn-picto" type="button">
              <i aria-hidden="true" className="material-icons">{this.props.post.published ? 'check_box' : 'check_box_outline_blank' }</i>
            </button>
            <button className="btn-picto" type="button" aria-label="Delete" title="Delete">
              <i aria-hidden="true" className="material-icons">{action}</i>
            </button>
          </div>
        </li>
      </Link>
    )
  }
  _renderAction = ({ id }) => {
    const deleteMutation = (
      <Mutation
        mutation={DELETE_MUTATION}
        update={(cache, { data }) => {
            const { feed } = cache.readQuery({ query: FEED_QUERY })
            cache.writeQuery({
              query: FEED_QUERY,
              data: {
                feed: feed.filter(post => post.id !== data.deletePost.id),
              },
            })
            const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
            cache.writeQuery({
              query: DRAFTS_QUERY,
              data: {
                drafts: drafts.filter(draft => draft.id !== data.deletePost.id),
              },
            })
        }}
      >
        {(deletePost, { data, loading, error }) => {
          return (
            <a onClick={async (e) => {
                if(window.confirm("Are you sure you want to delete this item?")) {
                  await deletePost({
                    variables: { id },
                  })
                  window.location.replace('/')
                }else {
                  e.preventDefault()
                }
              }}>
              delete
            </a>
          )
        }}
      </Mutation>
    )
      return (
        <Fragment>
          {deleteMutation}
        </Fragment>
      )
    return deleteMutation
  }
}

const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title
      published
    }
  }
`

const PUBLISH_MUTATION = gql`
  mutation PublishMutation($id: ID!) {
    publish(id: $id) {
      id
      published
    }
  }
`

const DELETE_MUTATION = gql`
  mutation DeleteMutatoin($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`
