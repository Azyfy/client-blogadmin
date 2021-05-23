import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';

const SinglePost = () => {

    const [ post, setPost ] = useState<any>();
    const [ loading, setLoading ] = useState(true);

    let history = useHistory();

    useEffect( () => {
        
        let pathname = window.location.pathname.split("/");

        axios.get(`http://localhost:3001/blogadmin/posts/${pathname[2]}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
              }   
        })
        .then((res) => {
            setPost(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error)
            history.push("/posts");
          })

      }, []);

return(
    <div> 
        { (loading == true) ? (
            <p>Loading...</p>
        ) : (
            <div>
                <h4> {post.title} </h4>
                <p> {post.text} </p>
            </div>
        )
        }
    </div>
)
};

export default SinglePost;