import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './spinner.css';

const SinglePost = () => {

    const [ post, setPost ] = useState<any>();
    const [ loading, setLoading ] = useState(true);
    const [ id, setId ] = useState("");

    let history = useHistory();

    useEffect( () => {
        
        let pathname = window.location.pathname.split("/");
        setId(pathname[2]);

        axios.get(`http://localhost:3001/blogadmin/posts/${pathname[2]}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }   
        })
        .then((res) => {
            setPost(res.data);
            setTimeout(function(){ setLoading(false); }, 2000);
          })
          .catch((error) => {
            console.error(error)
            history.push("/posts");
          })

      }, []);

      function deletePost () {
        axios.delete(`http://localhost:3001/blogadmin/posts/${id}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }   
        })
        .then((res) => {
            history.push("/posts");
          })
          .catch((error) => {
            console.error(error)
          })
      }

      function createMarkup(markup) {
        return {__html: markup};
      }

      function htmlDecode(content) {
        let e = document.createElement('div');
        e.innerHTML = content;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      }

return(
    <div className="p-7"> 
        { (loading === true) ? (
            <div className="spinner"></div>
        ) : (
            <>
            <a href="/posts" className="mx-3 px-2 border border-yellow-400 text-yellow-500 hover:underline hover:bg-blue-200"> Back </a>
            <div  className="my-7 border border-white">
                <h4 className="p-2 border border-black bg-blue-300 text-white"> {post.title} </h4>
                <div dangerouslySetInnerHTML={createMarkup(htmlDecode(post.text))} className="p-5 border border-black bg-white"></div>
            </div>

            <button onClick={deletePost} type="button" className="mx-3 px-2 border border-red-400 text-red-500 hover:underline hover:bg-blue-200"> Delete </button>
            </>
        )
        }
    </div>
)
};

export default SinglePost;