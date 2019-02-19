import React, { Component, Fragment } from 'react'
import Post from '../components/Post'
import { Query, Mutation } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { DRAFTS_QUERY } from './DraftsPage'
import CreatePage from './CreatePage'
import PostsPage from './PostsPage'
import Loader from 'react-loader-spinner'


export default class FeedPage extends Component {
  state = {
    title: '',
  }
  render() {
    return (
      <Query query={DRAFTS_QUERY}>
        {({ data, loading, error, refetch }) => {
          if (loading) {
            return (
              <div className="spinnerStyl">
                <Loader
                  type="Puff"
                  color="#3f51b5"
                  height="200"
                  width="200"
               />
              </div>
            )
          }

          if (error) {
            return (
              <div className="flex w-100 h-100 items-center justify-center pt7">
                <div>An unexpected error occured.</div>
              </div>
            )
          }

          return (
            <Fragment>
            <main id="todolist">
              <h1>Yael's TO-DO List<span>You can add, edit, and delete tasks.</span></h1>
              <br />
              <CreatePage />
              <br />
              <ul>
              {data.drafts &&
                data.drafts.map(post => (
                  <Post
                    key={post.id}
                    post={post}
                    refresh={() => refetch()}
                  />
                ))}
              {this.props.children}
              </ul>
              </main>
              <main id="donelist">
                <PostsPage />
              </main>
            </Fragment>
          )
        }}
      </Query>
    )
  }

  _renderAction = ({ id, published }) => {
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
            <a
              className="f6 dim br1 ba ph3 pv2 mb2 dib black pointer"
              onClick={async () => {
                await publish({
                  variables: { id },
                })
              }}
            >
              Publish
            </a>
          )
        }}
      </Mutation>
    )
    if (!published) {
      return (
        <Fragment>
          {publishMutation}
        </Fragment>
      )
    }
  }
}

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      title
      published
    }
  }
`
const CREATE_DRAFT_MUTATION = gql`
  mutation CreateDraftMutation($title: String!, $content: String!) {
    createDraft(title: $title, content: $content) {
      id
      title
      content
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
