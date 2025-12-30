import React, { useEffect, useState } from "react";
import './Player.css'
import back_arrow_icon from '../../assets/back_arrow_icon.png'
import { useNavigate, useParams } from "react-router-dom";
import netflix_spinner from '../../assets/netflix_spinner.gif'; 

interface Video{
    name: string;
    key: string;
    published_at: string;
    site:string;
    type: string;
}

interface VideoApiResponse{
    results: Video[];
}

const Player: React.FC = () => {

    const {id} = useParams<{id?: string}>();
    const navigate = useNavigate();

    const [apiData, SetApiData] = useState<Video | null>(null);

    const handleArrowNav = () => {
        navigate(-1);
    }
  
    useEffect(() => {

        if(!id) return;

          const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWQ4NGVkYmRmZjU3ZGFjMjNiYzNmNGNhZjBhOTZiYyIsIm5iZiI6MTc2NjA0MjI5MS4wODYwMDAyLCJzdWIiOiI2OTQzYWFiM2RjNmFiNzlmMzZlNmU3ZTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8ZLMu2VEOYzYDwh1obESwAx58ExKfOlI2mDOADyjwlM'
            }
        };


        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
                .then(res => res.json())
                .then((data: VideoApiResponse) => {
                    if(data.results && data.results.length > 0){
                        const trailer = data.results.find(vid => vid.site === "YouTube" && vid.type === "Trailer");

                        if(trailer){
                            SetApiData(trailer);
                        }else{
                            const anyYoutbe = data.results.find(vid => vid.site === "YouTube");
                            if(anyYoutbe){
                                SetApiData(anyYoutbe);
                            }
                        }
                    }
                })
                .catch(err => console.error(err));
    },[id])

    if (!apiData) {
        return (
            <div className="global-spinner">
                <img src={netflix_spinner} alt="loading" />
            </div>
        );
    }

        
    return(
       <div className="player">
            <img src={back_arrow_icon} alt="" onClick={handleArrowNav} />
            
            <iframe 
                width='90%' 
                height='90%'
                src={`https://www.youtube.com/embed/${apiData.key}?autoplay=1&mute=0&enablejsapi=1&origin=${window.location.origin}`}
                title="trailer"
                frameBorder='0'
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>

            <div className="player-info">
                <p>{apiData.published_at.slice(0, 10)}</p>
                <p>{apiData.name}</p>
                <p>{apiData.type}</p>
            </div>
        </div>
    )
}

export default Player;