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
	PropertySettings,
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
			let oldContent: string = "";
			let file: TFile;

			const fileDidExist = await this.app.vault.adapter.exists(fullPath);
			// Check if file already exists
			if (fileDidExist) {
				file = this.app.vault.getFileByPath(fullPath) as TFile;

				// Get old content and frontmatter if file exists
				if (!this.settings.overwriteContent) {
					oldContent = await this.app.vault.read(file);
				}

				if (!this.settings.overwriteFrontmatter) {
					const cache =
						this.app.metadataCache.getCache(fullPath)?.frontmatter;
					if (cache) {
						oldFrontmatter = { ...cache };
					}
				}
			}

			// Create or update file
			if (!fileDidExist || this.settings.overwriteContent) {
				await this.app.vault.adapter.write(
					fullPath,
					this.renderContent(book)
				);
				file = this.app.vault.getFileByPath(fullPath) as TFile;
			}

			// @ts-ignore
			this.app.fileManager.processFrontMatter(file, (frontmatter) => {
				// Handle properties from propertySet that are enabled
				Object.entries(this.settings.propertySet)
					.filter(([_, alias]) => alias != "")
					.forEach(([prop, alias]) => {
						

						// This 
						const newVal = book[prop as keyof PropertySettings]
						if (newVal != null && newVal != "" ) {
							delete oldFrontmatter[alias];
						 } else {
							console.log(book.title, alias , "   " ,newVal)
						 }
						
						frontmatter[alias] = newVal;
						
					});

				// Add remaining old properties
				Object.entries(oldFrontmatter).forEach(([key, value]) => {
					frontmatter[key] = value;
				});
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
