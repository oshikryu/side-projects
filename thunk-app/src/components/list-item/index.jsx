import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import './styles.css';

class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
  }

  getEditingMode = () => {

  }

  changeName = (val) => {
    this.props.onChangeName(val);
  }

  render() {
    const { name, lastModified } = this.props;
    const { isEditing } = this.state;
    
    if (name === '' || isEditing) {
      return (
        <div className="list-item-editing">
          <div className="list-item-name"> 
            <Input value={name} onChange={this.changeName} placeHolder="Name of your project"/>
          </div>
          <div className="list-item-last-modified"> 
            {lastModified}
          </div>
        </div>
      )
    } else {
      return (
        <div className="list-item">
          <div className="list-item-name"> 
            {name}
          </div>
          <div className="list-item-last-modified"> 
            {lastModified}
          </div>
        </div>
      );
    }
  }
}

ListItem.propTypes = {
  onChangeName: PropTypes.func,
};

export default ListItem;
