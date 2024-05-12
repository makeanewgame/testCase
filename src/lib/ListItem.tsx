import { Character } from "./Character";

export default function ListItem(props: {
    index: number,
    value: Character, 
    cursorIndex: number | null,
    selected: boolean,
    select: (value: Character) => void, inputValue: string } 
) {
    const { value, select, inputValue, cursorIndex, index,selected } = props;

    // check if the inputValue is part of the name and bold it
    const checkName = (name: string) => {
        if (inputValue === "") {
            return name;
        }
        const index = name.toLowerCase().indexOf(inputValue.toLowerCase());
        if (index === -1) {
            return name;
        }
        const firstPart = name.slice(0, index);
        const boldPart = name.slice(index, index + inputValue.length);
        const lastPart = name.slice(index + inputValue.length);
        return (
            <>
                {firstPart}
                <b>{boldPart}</b>
                {lastPart}
            </>
        );
    }

    return (
        <div className={`list-item ${cursorIndex === index ? "list-cursor" : null } `}>
            <input type="checkbox" className="list-item-checkbox" checked={selected} onChange={() => select(value)} />
            <img src={value.image} alt={value.name} width={36} height={36} />
            <div className="list-item-info">
                <span className="list-item-name">{checkName(value.name)}</span>
                <span className="list-item-episode">{value.episode} Episodes</span>
            </div>
        </div>
    );
}