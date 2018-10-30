import React from 'react';

/* 
 * This icon was created by http://svg-jsx.patmoody.com
 * Specify iconName and pass in optional className
 *
*/
export default (props) => {
  const iconName = 'EditIcon';
  const optionalClassName = props.className ? props.className : '';
  const onClick = props.onClick ? props.onClick : () =>{};

  return (
    <div onClick={onClick} className={`icon ${iconName} ${optionalClassName}`}>
      {/* svg generated code */}
      <svg height="24" width="24" fill="none" viewBox="0 0 24 24">
        <g opacity="0.65">
          <path d="M20.0248 19.3244H3.97419C3.58656 19.3244 3.27295 19.638 3.27295 20.0257C3.27295 20.4134 3.58656 20.727 3.97419 20.727H20.0248C20.4124 20.727 20.726 20.4134 20.726 20.0257C20.726 19.638 20.4124 19.3244 20.0248 19.3244ZM7.79205 17.0256L12.3793 15.0833C12.4533 15.0522 12.5196 15.0074 12.578 14.9509L20.315 7.213C20.8624 6.66558 20.8663 5.77335 20.3189 5.22593L18.7742 3.68108C18.2269 3.13366 17.3348 3.13756 16.7874 3.68498L9.05039 11.4229C8.9939 11.4793 8.9491 11.5475 8.91793 11.6216L6.97394 16.2074C6.86485 16.4646 6.94082 16.7236 7.10639 16.8912C7.27196 17.0587 7.53298 17.1347 7.79205 17.0256ZM17.7789 4.67656L17.7828 4.67267L19.3255 6.21557L19.3216 6.21946L18.1139 7.42729L16.5712 5.88439L17.7789 4.67656ZM10.149 12.3073L15.5797 6.87597L17.1224 8.41887L11.6917 13.8502L9.01532 14.984L10.149 12.3073Z" fill="black" fillOpacity="0.5"/>
        </g>
      </svg>
      {/* svg generated */}
    </div>
  );
};
