import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile,} from "obsidian";
import { parseFrontMatterEntry, parseYaml, getFrontMatterInfo, FrontMatterInfo, FrontMatterCache , } from 'obsidian';
import { SampleSettingTab } from 'settings';
// Remember to rename these classes and interfaces!
import { DEFAULT_SETTINGS, MyPluginSettings, User } from 'const';
import { launcher } from 'startup';
import { GraphQLClient } from 'graphql-request'
import { Client } from 'query';
import { Book } from 'const';
import { resolve } from 'path';
import * as path from 'path';
import { Render } from 'render';
import * as Mustache from "mustache";




export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	client: Client;
	render: Render;

	async onload() {

		this.render = new Render(this);
		await launcher(this)
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


	setClient(){
		this.client = new Client(this)
	}

	async fileWriter(){
		
		const response = await this.client.fetchUserBooks();

		console.log(response.username)
		
		//chceck if directory exists if not create it but with try catch
		if (!await this.app.vault.adapter.exists(this.settings.directory)){
			try {
				await this.app.vault.adapter.mkdir(this.settings.directory)
			} catch(error){
				console.error("Failed creating the directory!");
			}
		}


		response.books.forEach(async (book)  => {
			const fullPath = path.join(this.settings.directory, book.filename);

			let oldFrontmatter: FrontMatterCache | undefined;
			
			if (await this.app.vault.adapter.exists(fullPath)){
				oldFrontmatter = this.app.metadataCache.getCache(fullPath)?.frontmatter;
			} 

			//@ts-ignore
			await this.app.vault.adapter.write(fullPath, this.renderContent(book))
			// else {
			// 	oldFrontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
			// }
			
			

			const file = this.app.vault.getFileByPath(fullPath) as TFile;
		
			this.app.fileManager.processFrontMatter(file , frontmatter => {
				this.settings.properties.forEach(prop => {
					
					frontmatter[prop] = book[prop]
				});
				
				
			})
		});
		
		
	}


	renderContent(book: Book): string{
        
		var output = Mustache.render(this.settings.templateContent, book);
	  
		console.log(output)
	  
		return output
	  
	  
	  
	  
	  
}
}
