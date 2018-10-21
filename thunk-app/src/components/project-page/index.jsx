import React, { Component } from 'react';
import uuid from 'uuid';
import PlusSign from 'icons/PlusSign';
import ListItem from 'components/list-item';
import './styles.css';

const PROJECT_MODEL = {
  id: uuid(),
  name: '',
  lastModified: new Date(),
};

class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  createProject = () => {
    const { projects } = this.state;
    const projectCopy = projects.slice();
    projectCopy.push(PROJECT_MODEL);

    this.setState({
      projects: projectCopy,
    });
  }

  changeName= () => {

  }

  render() {
    const { projects } = this.state;

    return (
      <div className="project-page">
        <div className="project-page-header">
          MY PROJECTS
          <PlusSign onClick={this.createProject}/>
        </div>
        <div className="project-page-list">
          {projects.map((project) => {
            return (
              <ListItem onChangeName={this.changeName}/>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ProjectPage;
