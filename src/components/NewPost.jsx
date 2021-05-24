import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
require('dotenv').config()

const NewPost = () => {
    const [ title, setTitle ] = useState("");
    const [ error, setError ] = useState("");
    const editorRef = useRef(null);
    const log = () => {
     if (editorRef.current) {
       console.log(editorRef.current.getContent());
     }
   };

   let history = useHistory();

   function handleChangeTitle (e) {
    setTitle(e.target.value);
   }

   function handleSubmit (e) {
       e.preventDefault();

       axios.post("http://localhost:3001/blogadmin/posts/new", {
      title,
      text: editorRef.current.getContent() 
    }, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then( (res) => {
        if(res.data == "Post submitted!") {
        history.push("/posts");
        }
        else {
            setError("Form not submitted, try again.");
        }
    })
    .catch( (err) => {
      console.log(err)
      history.push("/");
    });

   }

    return(
        <>
        <form onSubmit={handleSubmit}>
        <input onChange={handleChangeTitle} type="text" id="title" name="title" placeholder="Title" />
        <Editor
        apiKey = {process.env.REACT_APP_API_KEY}
          onInit={(evt, editor) => editorRef.current = editor}
          init={{
            height: 500,
            menubar: false,
            content_css : 'document',
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect fontselect | ' +
            'bold italic underline backcolor forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'selectall copy paste | link unlink | fullscreen |' +
            'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
        <button> Submit post</button>
        <p> {error} </p>
        </form>
      </>
    )
}

export default NewPost;