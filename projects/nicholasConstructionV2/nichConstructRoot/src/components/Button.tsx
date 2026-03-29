import React from 'react'


interface ButtonProps {
  text: string,
  color: string
}


const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button className={` ${props.color} 
     font-bold py-2 px-4 my-4 rounded`}>
      {props.text}
    </button>
    )
}

export default Button