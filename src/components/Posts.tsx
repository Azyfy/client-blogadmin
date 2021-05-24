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

    return (
        <div>
            <div>
                <a href="/posts/new"> New </a>
                <a href="/" onClick={handleLogout}> Logout </a>
            </div>
            <div>
            <p> Posts </p>
            {posts.map( post => {
                return (
                    <div key={post._id}>
                        <Link key={post._id} to={`/posts/${post._id}`} >
                        <h5 key={post._id}> {post.title} </h5>
                        </Link>
                        <div key={post._id +1} dangerouslySetInnerHTML={createMarkup(post.text)}></div>
                    </div>
                );
            })
            }
            </div>
        </div>
    );
};

export default Posts;