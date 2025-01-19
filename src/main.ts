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
import { Render } from "render";
// import * as Mustache from "mustache";
import { log } from "./util";
const Mustache = require('mustache');

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	client: Client;
	render: Render;

	async onload() {
		this.render = new Render(this);
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
		log("GEths");
		const response: NewBook[] = await this.client.fetchUserBooks();
		log("ned")
		//chceck if directory exists if not create it but with try catch
		if (!(await this.app.vault.adapter.exists(this.settings.directory))) {
			try {
				await this.app.vault.adapter.mkdir(this.settings.directory);
			} catch (error) {
				console.error("Failed creating the directory!");
			}
		}
		log("AAAA")

		// const properties: (keyof NewBook)[] = this.settings.properties ||  ['title', 'author', 'dateFinished'];

		response.forEach(async (book) => {
			const fullPath = normalizePath(path.join(this.settings.directory, book.filename + ".md"));

			let oldFrontmatter: FrontMatterCache | undefined;

			if (await this.app.vault.adapter.exists(fullPath)) {
				oldFrontmatter =
					this.app.metadataCache.getCache(fullPath)?.frontmatter;
			}
			

			//@ts-ignore
			await this.app.vault.adapter.write(
				fullPath,
				this.renderContent(book)
			);
			// else {
			// 	oldFrontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
			// }
			log("gagekke")

			const file = this.app.vault.getFileByPath(fullPath) as TFile;

			log(file)

			this.app.fileManager.processFrontMatter(file, (frontmatter) => {
				this.settings.properties.forEach((prop) => {
					frontmatter[prop] = book[prop];
				});
			});
		});
	}

	renderContent(book: NewBook): string {
		log("GGGGG")
		var output = Mustache.render(this.settings.templateContent, book) as string;
		log("ERSE")
		console.log(output);

		return output;
	}
}
