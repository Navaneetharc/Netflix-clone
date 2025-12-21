import React, { useEffect, useState } from "react";
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams } from "react-router-dom";

interface Video{
    name: string;
    key: string;
    published_at: string;
    type: string;
}

interface VideoApiResponse{
    results: Video[];
}

const Player: React.FC = () => {

    const {id} = useParams<{id?: string}>();

    const navigate = useNavigate();

    const handleArrowNav = () => {
        navigate('/');
    }

    const [apiData,SetApiData] = useState<Video>({
        name:"",
        key:"",
        published_at: "",
        type:""
    })

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWQ4NGVkYmRmZjU3ZGFjMjNiYzNmNGNhZjBhOTZiYyIsIm5iZiI6MTc2NjA0MjI5MS4wODYwMDAyLCJzdWIiOiI2OTQzYWFiM2RjNmFiNzlmMzZlNmU3ZTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8ZLMu2VEOYzYDwh1obESwAx58ExKfOlI2mDOADyjwlM'
        }
    };

    useEffect(() => {

        if(!id) return;

        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
                .then(res => res.json())
                .then((data: VideoApiResponse) => {
                    if(data.results.length > 0){
                        SetApiData(data.results[0]);
                    }
                })
                .catch(err => console.error(err));
    },[id])

        
    return(
        <div className="player">
            <img src={back_arrow_icon} alt="" onClick={() => {handleArrowNav()}}/>
            <iframe width='90%' height='90%' 
            src={`https://www.youtube.com/embed/${apiData.key}`} 
            title="trailer" frameBorder='0' allowFullScreen></iframe>
            <div className="player-info">
                <p>{apiData.published_at.slice(0,10)}</p>
                <p>{apiData.name}</p>
                <p>{apiData.type}</p>
            </div>
        </div>
    )
}

export default Player