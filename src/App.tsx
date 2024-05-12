import { useEffect, useState } from "react";
import "./App.css";
import AutoComplete from "./lib/AutoComplete";
import { Character } from "./lib/Character";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [data, setData] = useState<Character[]>([]);

  useEffect(() => {
    if (searchValue !== "") {
      setLoading(true);

      //setTimeout to simulate a delay in the search
      setTimeout(() => {
        fetch(`https://rickandmortyapi.com/api/character/?name=${searchValue}`)
          .then((response) => response.json())
          .then((data) => {
            if (!data.error) {
              const characters: Character[] = data?.results.map((item: any) => {
                return {
                  name: item.name,
                  image: item.image,
                  episode: item.episode.length,
                };
              });
              setData(characters);
              setLoading(false);
            } else {
              setData([]);
              setLoading(false);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            setLoading(false);
          });
      }, 500);
    } else {
      setData([]);
    }
  }, [searchValue]);

  return (
    <div className="app">
      <AutoComplete
        list={data}
        setSearchValue={setSearchValue}
        isLoading={loading}
      />
    </div>
  );
}

export default App;
