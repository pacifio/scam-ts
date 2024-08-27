import * as fs from "node:fs";
import { exit } from "node:process";
import { createInterface } from "node:readline";

import { Scanner } from "./scanner";
import { Token } from "./token";

class ScamLang {
	private _hadError: boolean = true;

	private _runFile(path: string): void {
		if (fs.existsSync(path)) {
			const sourceCode: string = fs.readFileSync(path, "utf-8");
			this._run(sourceCode);

			if (this._hadError) exit(65);

			return;
		}

		console.log("Invalid path");
	}

	private _runPrompt(): void {
		const rl = createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		let running: boolean = true;
		while (true) {
			rl.question("> ", (answer: string) => {
				if (answer === "q" || answer === ".exit") {
					rl.close();
					running = false;
					return;
				}

				this._run(answer);
				this._hadError = false;
			});
		}
	}

	private _run(sourceCode: string): void {
		const scanner: Scanner = new Scanner(sourceCode);
		const tokens: Token[] = scanner.scanTokens();
		for (let token of tokens) {
			console.log(token);
		}
	}

	public static error(line: number, message: string): void {
		console.log(`[line ${line}]:: ${message}`);
	}

	private erorr(line: number, message: string): void {
		this.report(line, "", message);
	}

	private report(line: number, where: string, message: string): void {
		console.log(`[line ${line}]: Error ${where} :: ${message}`);
		this._hadError = true;
	}

	main(): void {
		const args: string[] = process.argv;
		if (args.length > 1) {
			console.log("Usage: scam [script]");
			exit(64);
			return;
		} else if (args.length == 1) {
			this._runFile(args[0]);
		} else {
			this._runPrompt();
		}
	}
}

export default ScamLang;
