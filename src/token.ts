import TokenType from "./tokentypes";

export class Token {
	type: TokenType;
	lexme: string | null;
	literal: Object | null;
	line: number;

	constructor(
		type: TokenType,
		lexme: string | null,
		literal: Object | null,
		line: number,
	) {
		this.type = type;
		this.lexme = lexme;
		this.literal = literal;
		this.line = line;
	}

	public toString(): string {
		return `${this.type} ${this.lexme} ${this.literal}`;
	}
}
