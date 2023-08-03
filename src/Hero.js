import {useState} from 'react'
import axios from 'axios';

export const Roulette = () => {

  const MAX = 650_000_000;
  const MAX_SPINS = 15;

  const [list, setList] = useState([]);
  const [numSpins, setNumSpins] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [rate, setRate] = useState({
    bad: 0,
    good: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setCurrentIndex(0);
    setList(list => []);
    let i = 0;
    while(i < numSpins) {
      let id = Math.floor(Math.random() * MAX);
      //to access scratch API you have to go through a cors proxy first
      let url = 'https://corsproxy.io/?' + encodeURIComponent(`https://api.scratch.mit.edu/projects/${id}`);
      let data = await fetch(url);
      if(data.ok) {
        setList(list => [...list, `https://scratch.mit.edu/projects/${id}`]);
        i += 1;
      }
    }
    setLoading(false);
  }

  const handleRatingSubmit = (e) => {
    setRate({
      bad: e.target.value === "bad" ? rate.bad + 1 : rate.bad,
      good: e.target.value === "good" ? rate.good + 1 : rate.good
    })
    setCurrentIndex(currentIndex + 1);
    if (currentIndex >= list.length - 1) {
      setList(list => []);
      setGames((games) => [...games, rate]);
      setRate({
        good: 0,
        bad: 0
      });
    }
  }

  const handleInputChange = (e) => {
    setNumSpins(e.target.value > MAX_SPINS ? MAX_SPINS : e.target.value);
  }

  return (
    <div className="flex flex-col justify-center items-center max-w-2xl">
        <img alt="..." src='./scratchroulette.png'/>
        {
          list.length > 0 && !loading ?
          (<div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-between mt-16 w-9/12">
              <p className="text-xl text-red-600">{rate.bad}</p>
              <h1 className='text-xl'>{`${currentIndex + 1}/${list.length}`}</h1>
              <p className="text-xl text-green-500">{rate.good}</p>
            </div>
            <div className="flex justify-evenly my-8">
              <button value="bad" onClick={handleRatingSubmit} className="transition east-in-out bg-red-600 w-fit py-2 px-8 rounded-xl text-white hover:bg-red-800 duration-300">🔥🗑️</button>
              <a className="p-4 mx-4 bg-orange-400 text-white rounded-xl" href={list[currentIndex]} target='_blank'>{`Click For Project ${currentIndex + 1}`}</a>
              <button value="good" onClick={handleRatingSubmit} className="transition east-in-out bg-green-500 w-fit py-2 px-8 rounded-xl text-white hover:bg-green-800 duration-300">😎👍</button>
            </div>
            {/* <button onClick={handleRatingSubmit} className="transition east-in-out my-8 bg-blue-500 w-fit py-2 px-8 rounded-xl text-white hover:bg-blue-800 duration-300">404</button> */}
          </div>)
          :
          ( loading ? (
            <img src="./loading.svg" className="m-4"/>
          ) : (
              <div className="flex flex-col items-center justify-center mt-16">
                <p className="mb-4">Number of Spins:</p>
                <input className="border-2 border-gray-300 rounded-xl p-2" value={numSpins} onInput={handleInputChange} placeholder={`${MAX_SPINS} Spins Max`}></input>
                <button onClick={handleSubmit} className="transition east-in-out my-16 bg-red-500 w-fit py-2 px-8 rounded-xl text-white hover:bg-red-800 duration-300">Spin!</button> 
              </div>
            )
          )
        }
        {
          games.length > 0 ? (
            <div className="flex flex-col items-center">
              <h1 className="text-2xl mb-4">Past Games</h1>
              <div className="flex flex-row items-center justify-center flex-wrap">
                {
                  games.map((game) => (
                    <div className={`flex justify-center items-center border-2 ${game.bad >= game.good ? "border-red-700" : "border-green-700"} ${game.bad >= game.good ? "bg-red-400" : "bg-green-400"} rounded-lg p-4 m-4`}>
                      <p className="text-white">{`${game.bad} | ${game.good}`}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : (
            <></>
          )
        }
    </div>
  )
}
