import {darken} from "polished";

export function getRandomDarkHexColor(): string {
	const getHexDigit = () => Math.floor(Math.random() * 16).toString(16);
	const getDarkColorComponent = () => getHexDigit() + getHexDigit().replace(/[89abcdef]/, '0');

	return `#${getDarkColorComponent()}${getDarkColorComponent()}${getDarkColorComponent()}`;
}

export function makeDarker(color: string, amount: number = 0.2) {
	return darken(amount, color)
}