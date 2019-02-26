import React, { useState } from 'react';
import { Button, Form, TextArea } from 'semantic-ui-react';

const MsgInput = props => {

  const [msg, setMsg] = useState("");
  const handleOnChange = e => {
    setMsg(e.target.value);
  };
  const handleSubmit = () => {
    if (msg !== "") {
      props.handlePosting(msg);
      setMsg("");
    } else {
      return; 
    }
  };

  return (
    <div >
        <Form >
          <Form.Field>
            <TextArea value={msg} placeholder='Enter Your Message' style={{width: '70vw'}} onChange={handleOnChange}/>
          </Form.Field>
          <Button onClick={handleSubmit} circular size="large" icon="paper plane outline" content="Send"/>
        </Form>
    </div>
  )
}

export default MsgInput;