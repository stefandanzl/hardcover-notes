import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { SampleSettingTab } from 'settings';
// Remember to rename these classes and interfaces!
import { DEFAULT_SETTINGS, MyPluginSettings } from 'const';
import { launcher } from 'startup';
import { GraphQLClient } from 'graphql-request'




export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	client: GraphQLClient;

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
		this.client = new GraphQLClient(this.settings.apiUrl, {
			headers: {
				authorization: this.settings.authBearer
			}
		})
	}
}
