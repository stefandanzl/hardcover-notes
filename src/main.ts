import {
	App,
	Editor,
	MarkdownView,
	Modal,
	normalizePath,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";
import {
	parseFrontMatterEntry,
	parseYaml,
	getFrontMatterInfo,
	FrontMatterInfo,
	FrontMatterCache,
} from "obsidian";
import { SampleSettingTab } from "settings";
// Remember to rename these classes and interfaces!
import {
	BookKey,
	DEFAULT_SETTINGS,
	MyPluginSettings,
	NewBook,
	User,
} from "const";
import { launcher } from "startup";
import { GraphQLClient } from "graphql-request";
import { Client } from "query";
import { Book } from "const";
import { resolve } from "path";
import * as path from "path";
// import * as Mustache from "mustache";
import { log } from "./util";
const Mustache = require("mustache");
const he = require("he");

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	client: Client;

	async onload() {
		await launcher(this);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	setClient() {
		this.client = new Client(this);
	}

	async fileWriter() {
		const response: NewBook[] = await this.client.fetchUserBooks();

		//chceck if directory exists if not create it but with try catch
		if (!(await this.app.vault.adapter.exists(this.settings.directory))) {
			try {
				await this.app.vault.adapter.mkdir(this.settings.directory);
			} catch (error) {
				console.error("Failed creating the directory!");
			}
		}

		// const properties: (keyof NewBook)[] = this.settings.properties ||  ['title', 'author', 'dateFinished'];

		response.forEach(async (book) => {
			const fullPath = normalizePath(
				path.join(this.settings.directory, book.filename + ".md")
			);

			let oldFrontmatter: Record<string, any> = {};

			if (await this.app.vault.adapter.exists(fullPath)) {
				const cache =
					this.app.metadataCache.getCache(fullPath)?.frontmatter;
				if (cache) {
					oldFrontmatter = { ...cache };
				}
			}

			//@ts-ignore
			await this.app.vault.adapter.write(
				fullPath,
				this.renderContent(book)
			);
			// else {
			// 	oldFrontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
			// }

			const file = this.app.vault.getFileByPath(fullPath) as TFile;

			this.app.fileManager.processFrontMatter(file, (frontmatter) => {
				this.settings.properties.forEach(async (prop) => {
					frontmatter[prop] = book[prop];
					delete oldFrontmatter[prop];
				});
				if (oldFrontmatter !== undefined) {
					Object.entries(oldFrontmatter).forEach(([key, value]) => {
						frontmatter[key] = value;
					});
				}
			});
		});
	}

	renderContent(book: NewBook): string {
		var output = Mustache.render(
			this.settings.templateContent,
			book
		) as string;

		return he.decode(output);
	}
}
