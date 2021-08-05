import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './spinner.css';

const SinglePost = () => {

    const [ post, setPost ] = useState<any>();
    const [ loading, setLoading ] = useState(true);
    const [ id, setId ] = useState("");
    const [ comments, setComments ] = useState([]);
    const [ comment, setComment ] = useState("");

    const history = useHistory();

    useEffect( () => {
        console.log("ue")
        const pathname = window.location.pathname.split("/");
        setId(pathname[2]);

        function getPost() {
          return axios.get(`http://localhost:3001/blogadmin/posts/${pathname[2]}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }
        });
        }

        function getComments() {
          return axios.get(`http://localhost:3001/blogadmin/comments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }   
          });
        }

        Promise.all([getPost(), getComments()])
          .then( (results) => {
            const returnedPost = results[0].data;
            const returnedComments = results[1].data;

            setPost(returnedPost);

            const postComments = returnedComments.filter( comment => { 
              return comment.blogpost._id === pathname[2]
             });
             setComments(postComments); 
             setLoading(false);
          }).catch((error) => {
              console.error(error)
              history.push("/posts")
          });

      }, [history]);

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
            setComments(comments.filter(comment => {
       
              return comment._id !== e.target.attributes.getNamedItem("data-comment").value }))
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
          setComments(comments.concat(res.data))
          setComment("")
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
            <div className="relative mb-5 px-5">
              { comments.map( comment => { 
                return (
                  <div key={comment._id} className="relative border-b border-black mb-5">
                    <h6  className="italic">{comment.user}</h6>
                    <p  className="pl-5">{comment.comment}</p>
                    <button  onClick={deleteComment} data-comment={comment._id} className="absolute right-0 top-0 border border-red-300 rounded-lg text-red-500 hover:border-red-700 px-1">x</button>
                  </div>
                )
              }) }
              <form onSubmit={handleSubmit}>
                <input onChange={handleChangeComment} value={comment} placeholder="Comment" type="text" id="comment" name="comment" required className="my-3 pl-2 border-2 border-yellow-400 focus:text-blue-400 placeholder-red-300 shadow-inner "/>
              </form>
            </div>

            <button onClick={deletePost} type="button" className="mx-3 px-2 border border-red-400 text-red-500 hover:underline hover:bg-blue-200"> Delete Post </button>
            </>
        )
        }
    </div>
)
};

export default SinglePost;