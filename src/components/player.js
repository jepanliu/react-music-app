import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
  faVolumeDown,
  faVolumeUp,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  songs,
  setCurrentSong,
  setSongs,
}) => {
  //Ref
  const audioRef = useRef(null);

  //Event handlers
  const activeLibraryHandler = (nextPrev) => {
    const newSongs = songs.map((song) => {
      if (song.id === nextPrev.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);
  };

  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();

      setIsPlaying(!isPlaying);
    }
  };

  const autoPlayHandler = () => {
    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration || 0;
    //calc percent
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animationPercent = Math.round(
      (roundedCurrent / roundedDuration) * 100
    );

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercent: animationPercent,
    });
  };

  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };

  //player time bar handler
  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  //player control
  const skipTrackHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "skip-forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === "skip-back") {
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[currentIndex - 1]);
        if (isPlaying) audioRef.current.play();
        return;
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
    }
    if (isPlaying) audioRef.current.play();
  };

  //auto play next song
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };

  //volume control
  const volumeSliderHandler = (e) => {
    const volumeValue = e.target.value / 100;
    audioRef.current.volume = volumeValue;
    setSongInfo({ ...songInfo, volume: e.target.value });
  };

  const volumeIcon = () => {
    if (songInfo.volume <= 50 && songInfo.volume >= 1) {
      return faVolumeDown;
    } else if (songInfo.volume >= 50) {
      return faVolumeUp;
    } else if (songInfo.volume <= 1) {
      return faVolumeOff;
    }
  };

  //State
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercent: 0,
    volume: 0.5,
  });

  //add styles
  const trackAnimation = {
    transform: `translateX(${songInfo.animationPercent}%)`,
  };
  return (
    <div className="player-container">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div
          style={{
            background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
          }}
          className="track"
        >
          <input
            min={0}
            max={songInfo.duration}
            value={songInfo.currentTime}
            onChange={dragHandler}
            type="range"
          />
          <div style={trackAnimation} className="animate-track"></div>
        </div>
        <p>{getTime(songInfo.duration)}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          className="skip-back"
          onClick={() => skipTrackHandler("skip-back")}
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          onClick={playSongHandler}
          className="play"
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          className="skip-forward"
          onClick={() => skipTrackHandler("skip-forward")}
          size="2x"
          icon={faAngleRight}
        />
      </div>
      <div className="volume">
        <FontAwesomeIcon className="volume-icon" icon={volumeIcon()} />
        <input type="range" min={0} max={100} onChange={volumeSliderHandler} />
      </div>
      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        onLoadedData={autoPlayHandler}
        onEnded={songEndHandler}
        ref={audioRef}
        src={currentSong.audio}
      ></audio>
    </div>
  );
};

export default Player;
