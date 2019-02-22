import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation, Query } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { DRAFTS_QUERY } from './DraftsPage'
import { FEED_QUERY } from './FeedPage'

class EditPage extends Component {
  state = {
    title: '',
    content: '',
    category: '',
    due_date: '',
  }

  render() {
    // let title = this.props.post.title
    return (
      <Query query={POST_QUERY} variables={{ id: this.props.match.params.id }}>
        {({ data, loading, error, refetch }) => {
          let postID = data.id;
          let postData = data.post;
          let editMute = this._renderAction(postData);
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          return (
            <div>{editMute}</div>
          )
        }}
      </Query>
    )
  }
  _renderAction = (postdata) => {
    const editMutation = (
    <Mutation
    mutation={UPDATE_DRAFT_MUTATION}
    update={(cache, { data }) => {
      const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
      const { feed } = cache.readQuery({ query: FEED_QUERY })
      cache.writeQuery({
        query: FEED_QUERY,
        data: { feed: feed.concat([data.update]) },
      })
      cache.writeQuery({
        query: DRAFTS_QUERY,
        data: { feed: feed.concat([data.update]) },
      })
    }}
  >

    {(update, { data, loading, error }) => {
      return (
        <main id="todolist">
          <div className="background">
          <h2>Edit Task</h2>
            <form
              onSubmit={async e => {
                e.preventDefault()
                console.log('id', this.props.match.params.id );
                console.log(this.state)
                let postid = postdata.id;
                console.log(postid);
                const { title, content, category, due_date } = this.state
                await update({
                  variables: { id: postid, title: title, content: content, category: category, due_date: due_date},
                })
                this.props.history.replace('/drafts')
                this.props.history.replace('/')
              }}>
              <input
                autoFocus
                onChange={e => this.setState({ title: e.target.value })}
                placeholder={postdata.title}
                type="text"
              />&nbsp;
              <input
                onChange={e => this.setState({ content: e.target.value })}
                placeholder={postdata.content}
                rows={8}
              /><br/>
              <select
              onChange={e => this.setState({ category: e.target.value })}
              placeholder="Select Category"
              name="category">
                 <option>{postdata.category}</option>
                 <option value="Chores">Chores</option>
                 <option value="Entertainment">Entertainment</option>
                 <option value="Family">Family</option>
                 <option value="Work">Work</option>
               </select>
                &nbsp;
              <input
                onChange={e => this.setState({ due_date: e.target.value })}
                type="date"
                placeholder={postdata.due_date}
                rows={8}
                value={this.state.due_date}
              /><br />
              <button type="submit">Update Task</button>
            </form>
          </div>
        </main>
      )
    }}
  </Mutation>);
  return editMutation;
  }
}

const POST_QUERY = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      id
      title
      content
      category
      due_date
      published
    }
  }
`

const UPDATE_DRAFT_MUTATION = gql`
  mutation UpdateMutation($id: ID!, $title: String, $content: String, $category: String, $due_date: String) {
    update(id: $id, title: $title, content: $content, category: $category, due_date: $due_date) {
      id
      title
      content
      category
      due_date
    }
  }
`


export default withRouter(EditPage)
