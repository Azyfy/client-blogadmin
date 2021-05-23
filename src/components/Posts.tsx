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

    return (
        <div>
            <p> Posts </p>
            {posts.map( post => {
                return (
                    <div key={post._id}>
                        <Link key={post._id} to={`/posts/${post._id}`} >
                        <h5 key={post._id}> {post.title} </h5>
                        </Link>
                        <p key={post._id +1}> {post.text} </p>
                    </div>
                );
            })
            }
        </div>
    );
};

export default Posts;