import { Character } from "./Character";

export default function Chip(props: { value: Character, removeChip: (character:Character) => void }) {
    const { value, removeChip } = props;

    return (
        <div className="chip">
            <span>
                {value.name}
            </span>
            <button onClick={ () => removeChip(value)} className="chip-button">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="22" height="22" rx="4" fill="#94A3B8" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.71967 10.7803L6 14.5L7.06066 15.5607L10.7803 11.841L14.5 15.5607L15.5607 14.5L11.841 10.7803L15.5607 7.06066L14.5 6L10.7803 9.71967L7.06066 6L6 7.06066L9.71967 10.7803Z" fill="white" />
                </svg>
            </button>
        </div>
    );
}