import React,{useEffect, useRef, useState} from "react";
import './TitleCards.css'
// import cards_data, { type Card } from '../../assets/cards/Cards_data'
import { Link } from "react-router-dom";


interface titleCardsProps{
    title:string;
    category:string;
}

interface Movie{
    id: number;
    backdrop_path: string | null;
    original_title: string;
}

interface MovieApiResponse{
    results: Movie[];
}

const TitleCards: React.FC<titleCardsProps> = ({title,category}) => {
    const cardsRef = useRef<HTMLDivElement | null>(null);
    const [apiData,SetApiData] = useState<Movie[]>([]);

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYWQ4NGVkYmRmZjU3ZGFjMjNiYzNmNGNhZjBhOTZiYyIsIm5iZiI6MTc2NjA0MjI5MS4wODYwMDAyLCJzdWIiOiI2OTQzYWFiM2RjNmFiNzlmMzZlNmU3ZTAiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.8ZLMu2VEOYzYDwh1obESwAx58ExKfOlI2mDOADyjwlM'
        }
        };

    const handleWheel = (event: WheelEvent) => {
        event.preventDefault();

        if(!cardsRef.current) return;

        cardsRef.current.scrollLeft += event.deltaY;
    }

    useEffect(() => {

        fetch(`https://api.themoviedb.org/3/movie/${category?category:"now_playing"}?language=en-US&page=1`, options)
            .then(res => res.json())
            .then((res: MovieApiResponse) => SetApiData(res.results))
            .catch(err => console.error(err));

        const el = cardsRef.current;
        if(!el) return;

        el.addEventListener("wheel", handleWheel);

        return () => {
            el.removeEventListener("wheel", handleWheel);
        };
    },[])

    return(
        <div className="titlecards">
            <h2>{title?title:"Popular on Netflix"}</h2>
            
            <div className="card-list" ref={cardsRef}>
                {apiData.map((card,index: number) => (
                    <Link to={`/player/${card.id}`} className="card" key={index}>
                        <img src={`https://image.tmdb.org/t/p/w500`+card.backdrop_path} alt="" />
                        <p>{card.original_title}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default TitleCards;