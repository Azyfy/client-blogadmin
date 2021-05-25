import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import axios from 'axios';

const Posts = () => {

    const [ posts, setPosts ] = useState<any>([]);

    let history = useHistory();

    useEffect(() => {
        axios.get("http://localhost:3001/blogadmin/posts", {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }   
        })
        .then((res) => {
            setPosts(res.data);
          })
          .catch((error) => {
            console.error(error)
            history.push("/");
          })

      }, []);

      function handleLogout () {
        localStorage.setItem('token', "");
      }

      function createMarkup(markup) {
        return {__html: markup};
      }

      function htmlDecode(content) {
        let e = document.createElement('div');
        e.innerHTML = content;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      }

    return (
        <div>
            <div className="my-7 flex justify-center">
                <a href="/posts/new" className="mx-3 px-2 border border-yellow-400 text-yellow-500 hover:underline hover:bg-blue-200"> New </a>
                <a href="/" onClick={handleLogout} className="mx-3 px-2 border border-yellow-400 text-yellow-500 hover:underline hover:bg-white hover:bg-blue-200"> Logout </a>
            </div>
            <div className="mx-3">
            {(posts.length === 0 ) ? ( 
                <p className="text-center"> There are no posts </p>
             ):(
                <> </>
             ) }
            {posts.map( post => {
                return (
                    <div key={post._id} className="my-7 border border-white">
                        <Link key={post._id} to={`/posts/${post._id}`} >
                        <h5 key={post._id} className="p-2 border border-black bg-blue-300 text-white hover:bg-white hover:text-black"> {post.title} </h5>
                        </Link>
                        <div key={post._id +1} dangerouslySetInnerHTML={(createMarkup(htmlDecode(post.text)))} className="p-5 border border-black bg-white"></div>
                    </div>
                );
            })
            }
            </div>
        </div>
    );
};

export default Posts;