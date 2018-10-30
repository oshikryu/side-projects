import React, { Component } from 'react';
import { Modal } from 'antd';
import uuid from 'uuid';
import PlusSign from 'icons/PlusSign';
import ListItem from 'components/list-item';
import './styles.css';

const PROJECT_MODEL = {
  id: null,
  name: '',
  lastModified: new Date(),
};

class ProjectPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      showDeleteModal: false,
      selectedProject: null,
    };
  }

  /* Generate a blank project model with some sort of id to distinguish it in local state
   *
   * @method createProject
   */
  createProject = () => {
    const { projects } = this.state;
    const projectCopy = projects.slice();
    projectCopy.push({
      ...PROJECT_MODEL,
      id: uuid(), // "random" id
    });

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
    const projIndex = projectCopy.findIndex((proj) => proj.id === project.id);
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
    const projIndex = projectCopy.findIndex((proj) => proj.id === project.id);
    if (projIndex < 0) {
      console.warn('invalid project index');
      return;
    }

    projectCopy.splice(projIndex, 1);
    this.setState({
      projects: projectCopy,
      showDeleteModal: false,
      selectedProject: null,
    });
  }

  /* Show modal before actually deleting project to confirm
   *
   * @method onShowDeleteModal
   */
  onShowDeleteModal = (project) => {
    this.setState({
      showDeleteModal: true,
      selectedProject: project,
    });
  }

  /* Hide modal before actually deleting project to confirm
   *
   * @method hideDeleteProject
   */
  onHideDeleteModal = () => {
    this.setState({
      showDeleteModal: false,
      selectedProject: null,
    });
  }

  renderDeleteModal = () => {
    const confirm = Modal.confirm;
    const { selectedProject } = this.state;
    confirm({
      title: 'Are you sure you want to delete this project?',
      content: 'This action cannot be undone.',
      onOk: () => {
        this.deleteProject(selectedProject);
      },
      onCancel: () => {
        this.onHideDeleteModal();
      },
      okText: 'Yes',
      cancelText: 'No',
    });
  }

  render() {
    const { projects, showDeleteModal } = this.state;

    return (
      <div className="project-page">
        <div className="project-page-header">
          MY PROJECTS
          <PlusSign onClick={this.createProject}/>
        </div>
        <div className="project-page-list">
          {projects.map((project, idx) => {
            return (
              <ListItem
                key={idx}
                project={project}
                onShowDeleteModal={this.onShowDeleteModal}
                onChangeProject={this.updateProject}
              />
            );
          })}
        </div>
        {showDeleteModal && this.renderDeleteModal()}
      </div>
    );
  }
}

export default ProjectPage;
