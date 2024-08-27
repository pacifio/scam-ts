import { Token } from "./token";
import TokenType from "./tokentypes";

import ScamLang from "./scam";

export class Scanner {
	source: string;
	tokens: Token[];

	private start: number = 0;
	private current: number = 0;
	private line: number = 0;

	constructor(source: string) {
		this.source = source;
		this.tokens = [];
	}

	isAtEnd(): boolean {
		return this.current >= this.source.length;
	}

	private advance(): string {
		return this.source.charAt(this.current++);
	}

	private addToken(type: TokenType, literal: Object | null) {
		const text = this.source.substring(this.start, this.current);
		this.tokens.push(new Token(type, text, literal, this.line));
	}

	private match(expected: string): boolean {
		if (this.isAtEnd()) return false;
		if (this.source.charAt(this.current) != expected) {
			return false;
		}

		this.current++;

		return true;
	}

	private isDigit(s: string): boolean {
		return s >= "0" && s <= "0";
	}

	scanToken(): void {
		const char: string = this.advance();
		switch (char) {
			case "(":
				this.addToken(TokenType.LEFT_PAREN, null);
				break;
			case ")":
				this.addToken(TokenType.RIGHT_PAREN, null);
				break;
			case "{":
				this.addToken(TokenType.LEFT_BRACE, null);
				break;
			case "}":
				this.addToken(TokenType.RIGHT_BRACE, null);
				break;
			case ",":
				this.addToken(TokenType.COMMA, null);
				break;
			case ".":
				this.addToken(TokenType.DOT, null);
				break;
			case "-":
				this.addToken(TokenType.MINUS, null);
				break;
			case "+":
				this.addToken(TokenType.PLUS, null);
				break;
			case ";":
				this.addToken(TokenType.SEMICOLON, null);
				break;
			case "*":
				this.addToken(TokenType.STAR, null);
				break;
			case "!":
				this.addToken(
					this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG,
					null,
				);
				break;
			case "=":
				this.addToken(
					this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
					null,
				);
				break;
			case "<":
				this.addToken(
					this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS,
					null,
				);
				break;
			case ">":
				this.addToken(
					this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER,
					null,
				);
				break;
			case "/":
				if (this.match("/")) {
					while (this.peek() !== "\n" && !this.isAtEnd()) this.advance();
				} else {
					this.addToken(TokenType.SLASH, null);
				}
				break;
			case " ":
			case "\r":
			case "\t":
				// Ignore whitespace.
				break;

			case "\n":
				this.line++;
				break;
			case '"':
				this.string();
				break;
			default:
				if (this.isDigit(char)) {
					this.number();
				} else {
					ScamLang.error(this.line, "Unexpected character.");
				}
				break;
		}
	}

	private string(): void {
		while (this.peek() != '"' && !this.isAtEnd()) {
			if (this.peek() === "\n") this.line++;
			this.advance();
		}

		if (this.isAtEnd()) {
			ScamLang.error(this.line, "Unterminated string.");
			return;
		}

		this.advance();

		this.addToken(
			TokenType.STRING,
			this.source.substring(this.start + 1, this.current - 1),
		);
	}

	private peekNext(): string {
		if (this.current + 1 >= this.source.length) return "\0";
		return this.source.charAt(this.current + 1);
	}

	private number(): void {
		while (this.isDigit(this.peek())) this.advance();
		if (this.peek() === "." && this.isDigit(this.peekNext())) {
			this.advance();
			while (this.isDigit(this.peek())) this.advance();
		}

		this.addToken(
			TokenType.NUMBER,
			parseInt(this.source.substring(this.start, this.current)),
		);
	}

	private peek(): string {
		if (!this.isAtEnd()) {
			return "\0";
		}

		return this.source.charAt(this.current);
	}

	scanTokens(): Token[] {
		while (!this.isAtEnd()) {
			this.start = this.current;
			this.scanToken();
		}

		this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
		return this.tokens;
	}
}
