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
    let category = this.props.post.category
    let date = this.props.post.due_date

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
        <li>
          <span className="label">
          <Link className="no-underline ma1" to={`/edit/${this.props.post.id}`}>{title}</Link><hr /><br />
          <span className="smalldescription">
          Description: {content}<br/>
          Status: {isPending}<br/>
          Category: {category}<br/>
          Due Date: {date}
          </span>
          </span>
          <div className="actions">
            {/*<button className="btn-picto" type="button">
              <i aria-hidden="true" className="material-icons">{this.props.post.published ? 'check_box' : 'check_box_outline_blank' }</i>
            </button>*/}
            <button className="btn-picto" type="button" aria-label="Delete" title="Delete">
              <i aria-hidden="true" className="material-icons">{action}</i>
            </button>
          </div>
        </li>
    )
  }
  _renderAction = ({ id }) => {
    const publishMutation = (
      <Mutation
        mutation={PUBLISH_MUTATION}
        update={(cache, { data }) => {
          const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
          const { feed } = cache.readQuery({ query: FEED_QUERY })
          cache.writeQuery({
            query: FEED_QUERY,
            data: { feed: feed.concat([data.publish]) },
          })
          cache.writeQuery({
            query: DRAFTS_QUERY,
          })
        }}
      >
        {(publish, { data, loading, error }) => {
          return (
            <button
              className="btn-picto"
              onClick={async () => {
                await publish({
                  variables: { id },
                })
                window.location.replace('/')
              }}
            >
              {this.props.post.published ? 'check_box' : 'check_box_outline_blank' }
            </button>
          )
        }}
      </Mutation>
    )
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
                  // window.location.replace('/')
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
          {publishMutation}
          {deleteMutation}
        </Fragment>
      )
    return deleteMutation
  }
}

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
