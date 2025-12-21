import React from "react";
import './Home.css'
import Navbar from "../../components/Navbar/Navbar";
// import hero_banner from "../../assets/hero_banner.jpg";
import hero_bannerST from "../../assets/hero-bannerST.jpg";
// import hero_title from "../../assets/hero_title.png";
import hero_title2 from "../../assets/hero-logoST.png";
import play_icon from "../../assets/play_icon.png"
import info_icon from "../../assets/info_icon.png"
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const Home: React.FC = () => {
    return(
        <div className="Home">
            <Navbar/>
            <div className="hero">
                <img src={hero_bannerST} alt="" className="banner-img"/>
                <div className="hero-caption">
                    <img src={hero_title2} alt="" className="caption-img"/>
                    <p>As the Upside Down spreads beyond Hawkins, old friends reunite to confront a final and deadly threat that could change their world forever.  
                        .</p>
                    <div className="hero-btns">
                        <button className="btn"><img src={play_icon} alt="" />Play</button>
                        <button className="btn dark-btn"><img src={info_icon} alt="" />More Info</button>
                    </div>
                    <TitleCards title={"Popular on Netflix"} category={"popular"}/>
                </div>
            </div>
            <div className="more-cards">
                <TitleCards title={"Blockbuster Movies"} category={"top_rated"}/>
                <TitleCards title={"Only on Netflix"} category={"now_playing"}/>
                <TitleCards title={"Upcoming"} category={"upcoming"}/>
                <TitleCards title={"Top pics for you"} category={"popular"}/>
            </div>
            <Footer />
        </div>
    )
}

export default Home