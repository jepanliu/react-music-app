import React, { useState } from "react";

//Adding styles
import "./styles/app.scss";

//Adding components
import Song from "./components/song";
import Player from "./components/player";
import Library from "./components/library";
import Nav from "./components/nav";

//Adding Util
import data from "./utils";

function App() {
  //State
  const [songs, setSongs] = useState(data);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);

  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} isPlaying={isPlaying} />
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
    </div>
  );
}

export default App;
