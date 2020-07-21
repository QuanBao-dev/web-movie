import React, { useEffect } from 'react';
const Name = (props) => {
  const { name } = props.match.params;
  useEffect(() => {
    console.log(name);
  })
  return (
    <div>{name}</div>
  )
}

export default Name