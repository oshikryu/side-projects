import React from 'react';

/* 
 * This icon was created by http://svg-jsx.patmoody.com
 * Specify iconName and pass in optional className
 *
*/
export default (props) => {
  const iconName = 'PlusSign';
  const optionalClassName = props.className ? props.className : '';
  return (
    <div className={`icon ${iconName} ${optionalClassName}`}>
      {/* svg generated code */}
      <svg height="18" width="18" fill="none" viewBox="0 0 18 18">
        <rect height="18" width="1.63636" fill="white" rx="0.818182" transform="rotate(90 18 8.18164)" x="18" y="8.18164"/>
        <rect height="18" width="1.63636" fill="white" rx="0.818182" transform="rotate(180 9.81836 18)" x="9.81836" y="18"/>
      </svg>
      {/* svg generated */}
    </div>
  );
};
