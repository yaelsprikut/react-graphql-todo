import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import  { gql } from 'apollo-boost'
import { DRAFTS_QUERY } from './DraftsPage'

class CreatePage extends Component {
  state = {
    title: '',
    content: '',
    category: '',
    due_date: '',
  }

  render() {
    return (
      <Mutation
        mutation={CREATE_DRAFT_MUTATION}
        update={(cache, { data }) => {
          const { drafts } = cache.readQuery({ query: DRAFTS_QUERY })
          cache.writeQuery({
            query: DRAFTS_QUERY,
            data: { drafts: drafts.concat([data.createDraft]) },
          })
        }}
      >
        {(createDraft, { data, loading, error }) => {
          return (
            <div className="background">
            <h2>Add task</h2>
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
                  placeholder="Add a to do..."
                  type="text"
                  value={this.state.title}
                />&nbsp;
                <input
                  onChange={e => this.setState({ content: e.target.value })}
                  placeholder="Add description..."
                  rows={8}
                  value={this.state.content}
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
                  type="date"
                  rows={8}
                  value={this.state.due_date}
                /><br />
                <button type="submit">Add item</button>
              </form>
            </div>
          )
        }}
      </Mutation>
    )
  }

}

const CREATE_DRAFT_MUTATION = gql`
  mutation CreateDraftMutation($title: String!, $content: String!, $category: String!, $due_date: String!) {
    createDraft(title: $title, content: $content, category: $category, due_date: $due_date) {
      id
      title
      content
      category
      due_date
    }
  }
`

export default withRouter(CreatePage)
