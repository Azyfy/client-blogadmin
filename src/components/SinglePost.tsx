import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './spinner.css';

const SinglePost = () => {

    const [ post, setPost ] = useState<any>();
    const [ loading, setLoading ] = useState(true);
    const [ id, setId ] = useState("");
    const [ comments, setComments ] = useState([]);
    const [ comment, setComment ] = useState("");

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
          })
          .catch((error) => {
            console.error(error)
            history.push("/posts")
          })

        //axios.all
        //this should get to memory leak, for now let it be
        axios.get(`http://localhost:3001/blogadmin/comments`, {
          headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }   
        })
        .then((res) => {
            let postComments = res.data.filter( comment => { 
              if (comment.blogpost._id === pathname[2]) {
                return comment;
              } 
             });
             setComments(postComments);
             setLoading(false);
          })
          .catch((error) => {
            console.error(error)
            history.push("/posts")
          })

      }, []);

      function deletePost (e) {
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

      function deleteComment (e) {
        axios.delete(`http://localhost:3001/blogadmin/comments/${e.target.attributes.getNamedItem("data-comment").value}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }   
        })
        .then((res) => {
          window.location.reload();
          })
          .catch((error) => {
            console.error(error)
          })
      }

      function handleChangeComment(e) {
        setComment(e.target.value);
      }

      function handleSubmit(e) {
        e.preventDefault();

        axios.post("http://localhost:3001/blogadmin/comments", {
          isadmin: true,
          user: "Admin",
          blogpost: id,
          comment,
          
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then( (res) => {
          console.log(res)
          window.location.reload();
      })
      .catch( (err) => {
        console.log(err)
      });
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
            <div>
              { comments.map( comment => { 
                return (
                  <div key={comment._id}>
                    <h6 key={comment._id}>{comment.user}</h6>
                    <p key={comment._id +1}>{comment.comment}</p>
                    <button key={comment._id + 2} onClick={deleteComment} data-comment={comment._id}>X</button>
                  </div>
                )
              }) }
              <form onSubmit={handleSubmit}>
                <input onChange={handleChangeComment} placeholder="Comment"/>
              </form>
            </div>

            <button onClick={deletePost} type="button" className="mx-3 px-2 border border-red-400 text-red-500 hover:underline hover:bg-blue-200"> Delete </button>
            </>
        )
        }
    </div>
)
};

export default SinglePost;