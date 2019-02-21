import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation, Query } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { DRAFTS_QUERY } from './DraftsPage'

class EditPage extends Component {
  state = {
    title: '',
    content: '',
    category: '',
    due_date: '',
  }

  render() {
    console.log('edit post', this.props)
    // let title = this.props.post.title
    return (
      <Query query={POST_QUERY} variables={{ id: this.props.match.params.id }}>
        {({ data, loading, error, refetch }) => {
          let editMute = this._renderAction(data);
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          console.log('data )))))  ', data)
          return (
            <div>{editMute}</div>
          )
        }}
      </Query>
    )
  }
  _renderAction = (data) => {
    const editMutation = (
       <Mutation
    mutation={PUBLISH_MUTATION}
    update={(cache, { data }) => {
      const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
      cache.writeQuery({
        query: POST_QUERY,
        data: { drafts: drafts.concat([data.createDraft]) },
      })
    }}
  >
    {(createDraft, { loading, error }) => {
      return (
        <div className="background">
        <h2>Edit Task</h2>
          <form
            onSubmit={async e => {
              e.preventDefault()
              const { title, content, category, due_date } = this.state
              await createDraft({
                variables: { title, content, category, due_date },
              })
              this.props.history.replace('/drafts')
              this.props.history.replace('/')
            }}>
            <input
              autoFocus
              onChange={e => this.setState({ title: e.target.value })}
              placeholder={data.post.title}
              type="text"
            />&nbsp;
            <input
              onChange={e => this.setState({ content: e.target.value })}
              placeholder={data.post.content}
              rows={8}
            /><br/>
            <select
            onChange={e => this.setState({ category: e.target.value })}
            value={this.state.category}
            placeholder="Select Category"
            name="category">
               <option default>Select Category</option>
               <option value="Chores">Chores</option>
               <option value="Entertainment">Entertainment</option>
               <option value="Family">Family</option>
               <option value="Work">Work</option>
             </select>
              &nbsp;
            <input
              onChange={e => this.setState({ due_date: e.target.value })}
              placeholder="Add due_date..."
              rows={8}
              value={this.state.due_date}
            /><br />
            <button type="submit">Update Task</button>
          </form>
        </div>
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
      due_date
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

export default withRouter(EditPage)
