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

  /* Add a project to state
   * TODO: move to redux flow
   *
   * @param {Object} project
   * @method updateProject
   */
  updateProject = (project) => {
    const { projects } = this.state;
    const projectCopy = projects.slice();
    const projIndex = projectCopy.findIndex((proj) => proj.id);
    if (projIndex < 0) {
      console.warn('invalid project index');
      return;
    }

    projectCopy.splice(projIndex, 1, project);

    this.setState({projects: projectCopy});
  }

  /* Remove a project from state
   * TODO: move to redux flow
   *
   * @param {Object} project
   * @method deleteProject
   */
  deleteProject = (project) => {
    const { projects } = this.state;
    const projectCopy = projects.slice();
    const projIndex = projectCopy.findIndex((proj) => proj.id);
    if (projIndex < 0) {
      console.warn('invalid project index');
      return;
    }

    projectCopy.splice(projIndex, 1);
    this.setState({projects: projectCopy});
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
              <ListItem
                key={project.id}
                project={project}
                onChangeProject={this.updateProject}
                onDeleteProject={this.deleteProject}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default ProjectPage;
