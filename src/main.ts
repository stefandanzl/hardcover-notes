import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { SampleSettingTab } from 'settings';
// Remember to rename these classes and interfaces!
import { DEFAULT_SETTINGS, MyPluginSettings } from 'const';





export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
