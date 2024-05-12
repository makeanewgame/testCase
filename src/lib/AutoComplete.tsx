import { useEffect, useRef, useState } from "react";
import Chip from "./Chip";
import ListItem from "./ListItem";
import { Character } from "./Character";

export default function AutoComplete(props: {
  isLoading: Boolean;
  list: Character[];
  setSearchValue: (value: string) => void;
}) {

  const debounceValue = 500; // debounce value in milliseconds and control the delay of the search trough the API
  const inputElement = useRef<HTMLInputElement>(null);
  const resultContainer = useRef<HTMLDivElement>(null);

  const { list, setSearchValue, isLoading } = props;

  const [inputValue, setInputValue] = useState<string>("");
  const [showList, setShowList] = useState<boolean>(false);
  const [selectedValues, setSelectedValues] = useState<Character[]>([]);
  const [cursorIndex, setCursorIndex] = useState<number>(-1);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  // check if the item is selected
  const checkIsSelected = (index: number) => {
    const found = selectedValues.find((item) => item.name === list[index].name);
    return found ? true : false;
  };

  // focus on the input element when the component is mounted
  useEffect(() => {
    inputElement.current?.focus();
  }, []);

// debounce the search value
  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchValue(inputValue);
    }, debounceValue);

    return () => clearTimeout(debounce);
  }, [inputValue, setSearchValue]);

  // handle the selection of the character and add or remove the chip
  const handleSelectCharacter = (character: Character) => {
    if (selectedValues.find((item) => item.name === character.name)) {
      removeChip(character);
      return;
    }
    setSelectedValues([...selectedValues, character]);
  };

  const removeChip = (character: Character) => {
    setSelectedValues(
      selectedValues.filter((item) => item.name !== character.name)
    );
  };

  // handle the key down event
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    let nextIndexCount = cursorIndex;

    // move down
    if (key === "ArrowDown")
      if (list.length > 0) {
        nextIndexCount = (cursorIndex + 1) % list.length;
      }

    // move up
    if (key === "ArrowUp")
      if (list.length > 0) {
        nextIndexCount = (cursorIndex + list.length - 1) % list.length;
      }

    // hide search results
    if (key === "Escape") {
      setShowList(false);
      setCursorIndex(-1);
      inputElement.current?.focus();
    }

    // select the current item and add it to the selected values
    if (key === "Enter") {
      event.preventDefault();
      handleSelectCharacter(list[cursorIndex]);
    }

    //if key backsoace is pressed and input value is empty then remove last chip
    if (key === "Backspace" && inputValue === "" && selectedValues.length > 0) {
      const lastSelectedValue = selectedValues.pop();
      setSelectedValues([...selectedValues]);
      setInputValue(lastSelectedValue?.name || "");
    }

    setCursorIndex(nextIndexCount);
  };

  // show the list when the list is not empty and the input value is not empty
  useEffect(() => {
    if ( (list.length > 0 || list.length === 0 ) && inputValue !== "") {
      setShowList(true);
    } else {
      setShowList(false);
    }
    //eslint-disable-next-line
  }, [list]);

  // scroll into view when the cursor index changes
  useEffect(() => {
    if (!resultContainer.current) return;
    resultContainer.current.scrollIntoView({
      block: "center",
    });
  }, [cursorIndex]);

  return (
    <div onKeyDown={handleKeyDown} tabIndex={1}>
      <div className="input-wrapper">
        <div className="chips-wrapper">
          {selectedValues.map((value: Character, index) => {
            return <Chip key={index} value={value} removeChip={removeChip} />;
          })}
          <input
            type="text"
            value={inputValue}
            onChange={onChange}
            placeholder="Search your favorite charater(s)"
            ref={inputElement}
          />
        </div>

        {isLoading && (
          <div className="spinner-wrapper">
            <div className="spinner"></div>
          </div>
        )}
        <div className="input-arrow" onClick={() => setShowList(!showList)}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.3199 14.9049L5.00294 10.2526C4.30804 9.64454 4.73808 8.5 5.66145 8.5H15.963C16.8706 8.5 17.3088 9.61177 16.6453 10.2311L11.6607 14.8834C11.2855 15.2335 10.7061 15.2428 10.3199 14.9049Z"
              fill="#475569"
            />
          </svg>
        </div>
      </div>
      {showList && (
        <div className="list-wrapper">
          {Array.isArray(list) && list.length > 0 ? (
            list.map((item, index) => {
              return (
                <div
                  key={index}
                  ref={index === cursorIndex ? resultContainer : null}
                >
                  <ListItem
                    selected={checkIsSelected(index)}
                    cursorIndex={cursorIndex}
                    index={index}
                    value={item}
                    select={handleSelectCharacter}
                    inputValue={inputValue}
                  />
                </div>
              );
            })
          ) : (
            <div className="no-data">No data found</div>
          )}
        </div>
      )}
    </div>
  );
}
