import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Row, Col, Input } from 'antd';

import EditIcon from 'icons/EditIcon';
import DeleteIcon from 'icons/DeleteIcon';

import './styles.css';
import 'antd/dist/antd.css';

const DATE_FORMAT = 'MMM DD, YYYY HH:mm a'

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      tempProperties: props.project,
    };
  }

  componentDidMount() {
    if (this.props.project.name === '') {
      this.setState({isEditing: true});
    }
  }

  getEditingMode = () => {
    this.setState({isEditing: true});
  }

  /* Propagate the changes from the temporary project model to the parent component
   *
   * @method changeProject
   */
  changeProject = () => {
    this.setState({isEditing: false});
    this.props.onChangeProject(this.state.tempProperties);
  }

  /* Mutate the tempProperties key for name
   * Not persisted until enter is pressed
   *
   * @method changeName
   */
  changeName = (evt) => {
    const name = evt.target.value;
    this.setState({
      tempProperties: {
        ...this.state.tempProperties,
        name,
      }
    });
  }

  /* Format date into a string format
   *
   * @param {Date} date
   * @method getDateDisplay
   * @return {String}
   */
  getDateDisplay = (date) => {
    const dateStr = moment(date).format(DATE_FORMAT);
    return dateStr;
  }

  render() {
    const { project } = this.props;
    const { name, lastModified } = project;
    const { isEditing, tempProperties } = this.state;
    const formattedModified = this.getDateDisplay(lastModified);
    
    if (isEditing) {
      return (
        <Row className="list-item-editing" type="flex" justify="space-between" key={`${project.id}`}>
          <Col span={2} className="project-icon"></Col>
          <Col span={7} className="list-item-name">
            <Input
              value={tempProperties.name}
              onPressEnter={this.changeProject}
              onChange={this.changeName}
              placeholder="Name of your project"
              className="list-item-editing-input"/>
          </Col>
          <Col span={8} className="list-item-last-modified">
            {formattedModified}
          </Col>
          <Col span={4}>
            <DeleteIcon onClick={() => this.props.onShowDeleteModal(project)} />
          </Col>
        </Row>
      )
    } else {
      return (
        <Row className="list-item" type="flex" justify="space-between" key={`${project.id}`}>
          <Col span={2} className="project-icon"></Col>
          <Col span={5} className="list-item-name-container" onClick={this.getEditingMode}>
            <div className="list-item-name">
              {name}
            </div>
          </Col>
          <Col span={2} className="list-item-name-container" onClick={this.getEditingMode}>
            <div className="list-item-name">
              <EditIcon />
            </div>
          </Col>
          <Col span={8} className="list-item-last-modified">
            {formattedModified}
          </Col>
          <Col span={4}>
            <DeleteIcon onClick={() => this.props.onShowDeleteModal(project)} />
          </Col>
        </Row>
      );
    }
  }
}

ListItem.propTypes = {
  project: PropTypes.object.isRequired,
  onChangeProject: PropTypes.func.isRequired,
  onShowDeleteModal: PropTypes.func.isRequired,
};

export default ListItem;
