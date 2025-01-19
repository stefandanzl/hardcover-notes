import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { SampleSettingTab } from 'settings';
// Remember to rename these classes and interfaces!
import { DEFAULT_SETTINGS, MyPluginSettings } from 'const';
import { launcher } from 'startup';
import { GraphQLClient } from 'graphql-request'
import { Client } from 'query';
import {write } from "./writer"




export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	client: Client;

	async onload() {
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

	async worker(){
		
		const response = await this.client.fetchUserBooks()

		write(books)

		this.app.vault.adapter.write("Hardcover/","")
	}
}
